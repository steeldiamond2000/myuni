import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"

// Public API - no authentication required
export async function GET(request: NextRequest, { params }: { params: Promise<{ qrcode: string }> }) {
  try {
    const { qrcode } = await params

    if (!qrcode) {
      return NextResponse.json({ success: false, error: "QR kod topilmadi" }, { status: 404 })
    }

    const asset = await prisma.asset.findFirst({
      where: { qrCodeValue: qrcode },
      include: {
        assignments: {
          where: { isActive: true },
          include: {
            employee: true,
          },
          take: 1,
        },
      },
    })

    if (!asset) {
      return NextResponse.json({ success: false, error: "Buyum topilmadi" }, { status: 404 })
    }

    const currentAssignment = asset.assignments[0]

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        name: asset.name,
        model: asset.model,
        inventoryNumber: asset.inventoryNumber,
        category: asset.category,
        status: asset.status,
        quantity: asset.quantity,
        purchaseDate: asset.purchaseDate,
        createdAt: asset.createdAt,
        assignedEmployee: currentAssignment?.employee
          ? {
              firstName: currentAssignment.employee.firstName,
              lastName: currentAssignment.employee.lastName,
              position: currentAssignment.employee.position,
              phone: currentAssignment.employee.phone,
            }
          : null,
        assignmentDate: currentAssignment?.startDate || null,
        assignmentComment: currentAssignment?.comment || null,
      },
    })
  } catch (error) {
    console.error("Public asset API error:", error)
    return NextResponse.json({ success: false, error: "Server xatosi" }, { status: 500 })
  }
}
