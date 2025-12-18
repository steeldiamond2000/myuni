import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("[v0] Testing database connection...")
    console.log("[v0] DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET")

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        // password ni ko'rsatmaymiz xavfsizlik uchun
      },
    })

    console.log("[v0] Found admins:", admins.length)

    return NextResponse.json({
      success: true,
      database: "connected",
      adminCount: admins.length,
      admins: admins.map((a) => ({ id: a.id, username: a.username, name: a.name })),
    })
  } catch (error: any) {
    console.log("[v0] Database error:", error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        databaseUrl: process.env.DATABASE_URL ? "SET" : "NOT SET",
      },
      { status: 500 },
    )
  }
}
