"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

type Employee = {
  id: string
  firstName: string
  lastName: string
  position: string
  phone: string | null
  hireDate: Date
  assignedAssetsCount: number
}

export default function ExportEmployeesButton({ employees }: { employees: Employee[] }) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employees }),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hodimlar_${format(new Date(), "yyyy-MM-dd")}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Excel fayl yuklab olindi")
    } catch (error) {
      toast.error("Eksport xatosi")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting} className="gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      {isExporting ? "Yuklanmoqda..." : "Excel"}
    </Button>
  )
}
