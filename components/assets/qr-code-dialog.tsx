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
    const printWindow = window.open("", "_blank", "width=227,height=227")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Label</title>
            <style>
              @page {
                size: 60mm 60mm;
                margin: 0 !important;
                padding: 0 !important;
              }

              @media print {
                html, body {
                  width: 60mm !important;
                  height: 60mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: hidden !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }

                /* Browser header/footer ni yashirish */
                @page {
                  margin: 0 !important;
                }
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
              }

              .label {
                width: 60mm;
                height: 60mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3mm;
                font-family: Arial, Helvetica, sans-serif;
              }

              .qr-code {
                width: 36mm;
                height: 36mm;
              }

              .qr-code img {
                width: 100%;
                height: 100%;
              }

              .inventory {
                font-size: 12pt;
                font-weight: bold;
                margin-top: 2mm;
                text-align: center;
              }

              .name {
                font-size: 7pt;
                text-align: center;
                margin-top: 1mm;
                max-width: 54mm;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            </style>
          </head>
          <body>
            <div class="label">
              <div class="qr-code">
                <img src="${qrDataUrl}" alt="QR" />
              </div>
              <div class="inventory">${inventoryNumber}</div>
              <div class="name">${assetName}</div>
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 100);
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
              className="border-2 border-dashed border-slate-300 rounded-lg bg-white"
              style={{ width: "170px", height: "170px" }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-2">
                <img src={qrDataUrl || "/placeholder.svg"} alt="QR Code" className="w-24 h-24" />
                <div className="font-bold text-xs mt-1">{inventoryNumber}</div>
                <div className="text-[10px] text-muted-foreground text-center truncate max-w-full">{assetName}</div>
              </div>
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground text-center">
            Chop etishda browser sozlamalarida "Headers and footers" ni o'chiring
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
