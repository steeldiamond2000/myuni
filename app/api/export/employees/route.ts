import { NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: Request) {
  try {
    const { employees } = await request.json()

    const data = employees.map((emp: any) => ({
      Ism: emp.firstName,
      Familiya: emp.lastName,
      Lavozim: emp.position,
      Telefon: emp.phone || "-",
      "Ishga kirgan sana": new Date(emp.hireDate).toLocaleDateString("uz-UZ"),
      "Biriktirilgan buyumlar soni": emp.assignedAssetsCount,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hodimlar")

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=hodimlar.xlsx",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
