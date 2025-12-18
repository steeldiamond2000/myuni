import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: Request) {
  try {
    const { assignments } = await request.json()

    const data = assignments.map((assignment: any) => ({
      "Buyum nomi": assignment.asset.name,
      "Inventar raqami": assignment.asset.inventoryNumber,
      "Hodim F.I.Sh": `${assignment.employee.firstName} ${assignment.employee.lastName}`,
      Lavozimi: assignment.employee.position,
      "Javobgarlik boshlangan sana": new Date(assignment.startDate).toLocaleDateString("uz-UZ"),
      "Javobgarlik tugagan sana": assignment.endDate
        ? new Date(assignment.endDate).toLocaleDateString("uz-UZ")
        : "Hali aktiv",
      Izoh: assignment.comment || "-",
      Status: assignment.isActive ? "Aktiv" : "Yopilgan",
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Javobgarlik Tarixi")

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=javobgarlik-tarixi.xlsx",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
