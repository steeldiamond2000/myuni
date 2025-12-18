"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { generateQRValue } from "@/lib/qr-code"

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
  const qrCodeValue = generateQRValue()

  await prisma.asset.create({
    data: {
      name: data.name,
      model: data.model || null,
      inventoryNumber: data.inventoryNumber,
      category: data.category,
      purchaseDate: data.purchaseDate,
      quantity: data.quantity,
      status: data.status,
      qrCodeValue,
    },
  })

  revalidatePath("/admin/assets")
}

export async function updateAsset(id: string, data: AssetData) {
  await prisma.asset.update({
    where: { id },
    data: {
      name: data.name,
      model: data.model || null,
      category: data.category,
      purchaseDate: data.purchaseDate,
      quantity: data.quantity,
      status: data.status,
    },
  })

  revalidatePath("/admin/assets")
}

export async function deleteAsset(id: string) {
  await prisma.asset.delete({
    where: { id },
  })

  revalidatePath("/admin/assets")
}
