"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { generateQRValue } from "@/lib/qr-code"

export async function assignEmployee(assetId: string, employeeId: string, startDate: Date, comment: string) {
  try {
    // Yangi QR kod generatsiya qilish
    const newQrCode = generateQRValue()

    await prisma.$transaction(async (tx) => {
      // Buyumga yangi QR kod belgilash
      await tx.asset.update({
        where: { id: assetId },
        data: { qrCodeValue: newQrCode },
      })

      // Javobgarlik yaratish
      await tx.assetAssignment.create({
        data: {
          assetId,
          employeeId,
          startDate: new Date(startDate),
          comment: comment || null,
          isActive: true,
        },
      })
    })

    revalidatePath("/admin/assets")
    revalidatePath("/admin/assignments")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] assignEmployee error:", error)
    return { success: false, error: "Javobgar biriktirishda xatolik yuz berdi" }
  }
}

export async function reassignEmployee(assetId: string, newEmployeeId: string, startDate: Date, comment: string) {
  try {
    // Yangi QR kod generatsiya qilish
    const newQrCode = generateQRValue()

    await prisma.$transaction(async (tx) => {
      // Oldingi javobgarlikni yopish
      await tx.assetAssignment.updateMany({
        where: {
          assetId,
          isActive: true,
        },
        data: {
          endDate: new Date(),
          isActive: false,
        },
      })

      // Buyumga yangi QR kod belgilash
      await tx.asset.update({
        where: { id: assetId },
        data: { qrCodeValue: newQrCode },
      })

      // Yangi javobgarlikni yaratish
      await tx.assetAssignment.create({
        data: {
          assetId,
          employeeId: newEmployeeId,
          startDate: new Date(startDate),
          comment: comment || null,
          isActive: true,
        },
      })
    })

    revalidatePath("/admin/assets")
    revalidatePath("/admin/assignments")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] reassignEmployee error:", error)
    return { success: false, error: "Javobgarni o'zgartirishda xatolik yuz berdi" }
  }
}

export async function cancelAssignment(assetId: string, comment: string, endDate: Date) {
  try {
    await prisma.$transaction(async (tx) => {
      // Javobgarlikni yopish
      await tx.assetAssignment.updateMany({
        where: {
          assetId,
          isActive: true,
        },
        data: {
          endDate: new Date(endDate),
          comment: comment || null,
          isActive: false,
        },
      })

      // QR kodni o'chirish (javobgar yo'q bo'lganda QR kod ham kerak emas)
      await tx.asset.update({
        where: { id: assetId },
        data: { qrCodeValue: null },
      })
    })

    revalidatePath("/admin/assets")
    revalidatePath("/admin/assignments")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] cancelAssignment error:", error)
    return { success: false, error: "Javobgarlikni bekor qilishda xatolik yuz berdi" }
  }
}
