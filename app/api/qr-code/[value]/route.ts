import { NextResponse } from "next/server"
import { generateQRCodeDataURL } from "@/lib/qr-code"

export async function GET(request: Request, { params }: { params: Promise<{ value: string }> }) {
  const { value } = await params
  try {
    const dataUrl = await generateQRCodeDataURL(value)
    return NextResponse.json({ dataUrl })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
