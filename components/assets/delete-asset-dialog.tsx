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
import { deleteAsset } from "@/app/actions/assets"
import { Loader2 } from "lucide-react"

type Props = {
  children: ReactNode
  assetId: string
  assetName: string
}

export default function DeleteAssetDialog({ children, assetId, assetName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const result = await deleteAsset(assetId)
      if (result.success) {
        toast.success("Buyum o'chirildi")
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
          <AlertDialogTitle>Buyumni o'chirish</AlertDialogTitle>
          <AlertDialogDescription>
            {assetName} ni o'chirishni tasdiqlaysizmi? Barcha javobgarlik tarixi ham o'chiriladi. Bu amalni qaytarib
            bo'lmaydi.
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
