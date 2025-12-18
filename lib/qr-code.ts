import QRCode from "qrcode"
import { randomUUID } from "crypto"

export function generateQRValue(): string {
  return randomUUID()
}

export async function generateQRCodeDataURL(value: string, baseUrl = "http://localhost:3000"): Promise<string> {
  const url = `${baseUrl}/asset/${value}`
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  })
}

export async function generateQRCodeBuffer(value: string, baseUrl = "http://localhost:3000"): Promise<Buffer> {
  const url = `${baseUrl}/asset/${value}`
  return await QRCode.toBuffer(url, {
    width: 500,
    margin: 2,
  })
}
