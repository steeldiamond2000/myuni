"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function assignEmployee(assetId: string, employeeId: string, startDate: Date, comment: string) {
  await prisma.assetAssignment.create({
    data: {
      assetId,
      employeeId,
      startDate,
      comment: comment || null,
      isActive: true,
    },
  })

  revalidatePath("/admin/assets")
}

export async function reassignEmployee(assetId: string, newEmployeeId: string, startDate: Date, comment: string) {
  // Oldingi javobgarlikni yopish
  await prisma.assetAssignment.updateMany({
    where: {
      assetId,
      isActive: true,
    },
    data: {
      endDate: new Date(),
      isActive: false,
    },
  })

  // Yangi javobgarlikni yaratish
  await prisma.assetAssignment.create({
    data: {
      assetId,
      employeeId: newEmployeeId,
      startDate,
      comment: comment || null,
      isActive: true,
    },
  })

  revalidatePath("/admin/assets")
}

export async function cancelAssignment(assetId: string, comment: string, endDate: Date) {
  await prisma.assetAssignment.updateMany({
    where: {
      assetId,
      isActive: true,
    },
    data: {
      endDate,
      comment: comment || null,
      isActive: false,
    },
  })

  revalidatePath("/admin/assets")
}
