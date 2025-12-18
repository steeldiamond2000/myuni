import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Buyum topilmadi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">Bu QR kod noto'g'ri yoki buyum tizimdan o'chirilgan bo'lishi mumkin.</p>
          <div className="pt-4">
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <Link href="/login">
                <Home className="h-4 w-4" />
                Admin panelga kirish
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
