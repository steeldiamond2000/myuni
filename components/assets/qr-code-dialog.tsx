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
    const shortName = assetName.length > 70 ? assetName.substring(0, 67) + "..." : assetName

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Label ${inventoryNumber}</title>
            <style>
              @page {
                size: 60mm 60mm;
                margin: 0;
              }

              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              html, body {
                width: 60mm;
                height: 60mm;
                margin: 0;
                padding: 0;
                background: white;
                overflow: hidden;
              }

              .label-container {
                width: 60mm;
                height: 60mm;
                position: relative;
                background: white;
              }

              .content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
              }

              .qr-code {
                width: 32mm;
                height: 32mm;
                margin: 0 auto;
              }

              .qr-code img {
                width: 100%;
                height: 100%;
                display: block;
              }

              .inventory-number {
                font-family: Arial, sans-serif;
                font-size: 11pt;
                font-weight: bold;
                margin-top: 2mm;
                color: #000;
              }

              .asset-name {
                font-family: Arial, sans-serif;
                font-size: 9pt;
                font-weight: bold;
                margin-top: 1mm;
                color: #333;
                max-width: 50mm;
                word-wrap: break-word;
              }

              @media print {
                html, body {
                  width: 60mm;
                  height: 60mm;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            <div class="label-container">
              <div class="content">
                <div class="qr-code">
                  <img src="${qrDataUrl}" alt="QR" />
                </div>
                <div class="inventory-number">${inventoryNumber}</div>
                <div class="asset-name">${shortName}</div>
              </div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 200);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
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
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg bg-white relative"
              style={{ width: "170px", height: "170px" }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="w-20 h-20 mx-auto" />
                <div className="font-bold text-xs mt-1">{inventoryNumber}</div>
                <div className="text-[9px] text-muted-foreground text-center max-w-[150px] truncate">{assetName}</div>
              </div>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground text-center">
            Print dialogda: More settings → Headers and footers → O'chirish
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
