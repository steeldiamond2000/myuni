"use client"

import { useState, useEffect, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, ExternalLink } from "lucide-react"
import { toast } from "sonner"

type Props = {
  children: ReactNode
  assetId: string
  assetName: string
  qrValue: string
}

export default function QRCodeDialog({ children, assetId, assetName, qrValue }: Props) {
  const [open, setOpen] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [qrUrl, setQrUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && !qrDataUrl) {
      loadQRCode()
    }
  }, [open])

  const loadQRCode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/qr-code/${qrValue}`)
      const data = await response.json()
      setQrDataUrl(data.dataUrl)
      setQrUrl(data.url)
    } catch (error) {
      toast.error("QR kodni yuklab bo'lmadi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = qrDataUrl
    a.download = `qr-${assetName.replace(/\s+/g, "-")}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success("QR kod yuklab olindi")
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Kod - ${assetName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 400px;
                margin: 20px 0;
              }
              h2 {
                margin: 10px 0;
              }
              @media print {
                body {
                  margin: 0;
                }
              }
            </style>
          </head>
          <body>
            <h2>${assetName}</h2>
            <img src="${qrDataUrl}" alt="QR Code" />
            <p>Skanerlang va buyum haqida ma'lumot oling</p>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  const handlePreview = () => {
    if (qrUrl) {
      window.open(qrUrl, "_blank")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Kod</DialogTitle>
          <DialogDescription>{assetName}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="w-64 h-64 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
              Yuklanmoqda...
            </div>
          ) : qrDataUrl ? (
            <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
          ) : null}
          <p className="text-sm text-muted-foreground text-center">
            Bu QR kodni xprinterda chop etib, buyumga yopshtiring
          </p>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-2 w-full">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
                disabled={!qrDataUrl}
              >
                <Download className="h-4 w-4" />
                Yuklab olish
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 gap-2 bg-transparent"
                disabled={!qrDataUrl}
              >
                <Printer className="h-4 w-4" />
                Chop etish
              </Button>
            </div>
            <Button onClick={handlePreview} variant="secondary" className="w-full gap-2" disabled={!qrUrl}>
              <ExternalLink className="h-4 w-4" />
              Public sahifani ko'rish
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
