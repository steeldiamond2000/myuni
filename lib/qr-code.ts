import QRCode from "qrcode"
import { randomUUID } from "crypto"

export function generateQRValue(): string {
  return randomUUID()
}

export function getBaseUrl(): string {
  // Vercel production
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  // Vercel preview
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // NEXTAUTH_URL dan olish
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  // Local development
  return "http://localhost:3000"
}

export async function generateQRCodeDataURL(value: string, baseUrl?: string): Promise<string> {
  const url = `${baseUrl || getBaseUrl()}/asset/${value}`
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  })
}

export async function generateQRCodeBuffer(value: string, baseUrl?: string): Promise<Buffer> {
  const url = `${baseUrl || getBaseUrl()}/asset/${value}`
  return await QRCode.toBuffer(url, {
    width: 500,
    margin: 2,
  })
}
