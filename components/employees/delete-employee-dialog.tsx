"use client"
import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { deleteEmployee } from "@/app/actions/employees"
import { Loader2 } from "lucide-react"

type Props = {
  children: ReactNode
  employeeId: string
  employeeName: string
  hasAssignments: boolean
}

export default function DeleteEmployeeDialog({ children, employeeId, employeeName, hasAssignments }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteEmployee(employeeId)
      if (result.success) {
        toast.success("Hodim o'chirildi")
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error || "Xatolik yuz berdi")
      }
    } catch (error) {
      toast.error("Kutilmagan xatolik yuz berdi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hodimni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            {hasAssignments ? (
              <span className="text-destructive font-medium">
                Diqqat! {employeeName} ga biriktirilgan buyumlar mavjud. Hodimni o'chirish barcha biriktirilgan
                buyumlarni ham o'chiradi. Davom etishni xohlaysizmi?
              </span>
            ) : (
              <span>{employeeName} ni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Bekor qilish</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                O'chirilmoqda...
              </>
            ) : (
              "O'chirish"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
