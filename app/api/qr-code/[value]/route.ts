import { NextResponse } from "next/server"
import { generateQRCodeDataURL, getBaseUrl } from "@/lib/qr-code"
import { headers } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ value: string }> }) {
  const { value } = await params
  try {
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = headersList.get("x-forwarded-proto") || "https"

    // Agar host mavjud bo'lsa, undan foydalanish
    const baseUrl = host ? `${protocol}://${host}` : getBaseUrl()
    const url = `${baseUrl}/asset/${value}`

    const dataUrl = await generateQRCodeDataURL(value, baseUrl)
    return NextResponse.json({ dataUrl, url })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
