import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

const STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  good: "Qoniqarli",
  needs_repair: "Ta'mirtalab",
  old: "Eski",
}

const CATEGORY_LABELS: Record<string, string> = {
  electronic: "Elektron qurilma",
  material: "Moddiy buyum",
}

export async function POST(request: Request) {
  try {
    const { assets } = await request.json()

    const data = assets.map((asset: any) => ({
      "Inventar raqami": asset.inventoryNumber,
      "Buyum nomi": asset.name,
      Modeli: asset.model || "-",
      Kategoriya: CATEGORY_LABELS[asset.category],
      Status: STATUS_LABELS[asset.status],
      "Sotib olingan sana": new Date(asset.purchaseDate).toLocaleDateString("uz-UZ"),
      Soni: asset.quantity,
      "Javobgar shaxs": asset.currentAssignment
        ? `${asset.currentAssignment.employee.firstName} ${asset.currentAssignment.employee.lastName}`
        : "Javobgar yo'q",
      "Javobgar lavozimi": asset.currentAssignment ? asset.currentAssignment.employee.position : "-",
      "Javobgarlik boshlangan sana": asset.currentAssignment
        ? new Date(asset.currentAssignment.startDate).toLocaleDateString("uz-UZ")
        : "-",
      "Javobgarlik izohi": asset.currentAssignment?.comment || "-",
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buyumlar")

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=buyumlar.xlsx",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
