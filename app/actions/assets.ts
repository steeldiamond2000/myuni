"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type AssetData = {
  name: string
  model: string
  inventoryNumber: string
  category: string
  purchaseDate: Date
  quantity: number
  status: string
}

export async function createAsset(data: AssetData) {
  try {
    const asset = await prisma.asset.create({
      data: {
        name: data.name,
        model: data.model || null,
        inventoryNumber: data.inventoryNumber,
        category: data.category,
        purchaseDate: new Date(data.purchaseDate),
        quantity: data.quantity,
        status: data.status,
        qrCodeValue: `pending-${Date.now()}`,
      },
    })

    revalidatePath("/admin/assets")
    return { success: true, asset }
  } catch (error: any) {
    console.error("[v0] createAsset error:", error)
    if (error.code === "P2002") {
      return { success: false, error: "Bu inventar raqami allaqachon mavjud" }
    }
    return { success: false, error: "Buyum qo'shishda xatolik yuz berdi" }
  }
}

export async function updateAsset(id: string, data: AssetData) {
  try {
    await prisma.asset.update({
      where: { id },
      data: {
        name: data.name,
        model: data.model || null,
        category: data.category,
        purchaseDate: new Date(data.purchaseDate),
        quantity: data.quantity,
        status: data.status,
      },
    })

    revalidatePath("/admin/assets")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] updateAsset error:", error)
    return { success: false, error: "Buyumni yangilashda xatolik yuz berdi" }
  }
}

export async function deleteAsset(id: string) {
  try {
    await prisma.asset.delete({
      where: { id },
    })

    revalidatePath("/admin/assets")
    return { success: true }
  } catch (error: any) {
    console.error("[v0] deleteAsset error:", error)
    return { success: false, error: "Buyumni o'chirishda xatolik yuz berdi" }
  }
}
