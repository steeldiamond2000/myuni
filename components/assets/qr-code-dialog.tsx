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
  inventoryNumber: string
  qrValue: string
}

export default function QRCodeDialog({ children, assetId, assetName, inventoryNumber, qrValue }: Props) {
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
    a.download = `qr-${inventoryNumber}-${assetName.replace(/\s+/g, "-")}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success("QR kod yuklab olindi")
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Label - ${inventoryNumber}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              @page {
                size: 60mm 60mm;
                margin: 0;
              }

              body {
                width: 60mm;
                height: 60mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: 'Arial', sans-serif;
                padding: 2mm;
                background: white;
              }

              .qr-container {
                width: 40mm;
                height: 40mm;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .qr-container img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }

              .info {
                width: 100%;
                text-align: center;
                margin-top: 2mm;
              }

              .inventory-number {
                font-size: 11pt;
                font-weight: bold;
                letter-spacing: 0.5px;
                margin-bottom: 1mm;
              }

              .asset-name {
                font-size: 8pt;
                color: #333;
                line-height: 1.2;
                max-height: 10mm;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" />
            </div>
            <div class="info">
              <div class="inventory-number">${inventoryNumber}</div>
              <div class="asset-name">${assetName}</div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
      }, 300)
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
          <DialogTitle>QR Kod - Label (6x6 cm)</DialogTitle>
          <DialogDescription>
            {inventoryNumber} - {assetName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center">
              Yuklanmoqda...
            </div>
          ) : qrDataUrl ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 bg-white">
              <div className="w-48 h-48 flex flex-col items-center justify-center">
                <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="w-32 h-32 mb-2" />
                <div className="text-center">
                  <div className="font-bold text-sm">{inventoryNumber}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{assetName}</div>
                </div>
              </div>
            </div>
          ) : null}
          <p className="text-sm text-muted-foreground text-center">
            Xprinter uchun 6x6 cm label formatida chop etiladi
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
              <Button onClick={handlePrint} variant="default" className="flex-1 gap-2" disabled={!qrDataUrl}>
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
