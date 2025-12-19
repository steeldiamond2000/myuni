import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 60 // 60 soniya cache

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { firstName: "asc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
      },
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error("[v0] GET employees error:", error)
    return NextResponse.json({ error: "Hodimlarni yuklashda xatolik" }, { status: 500 })
  }
}
