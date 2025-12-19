import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Home, Building2 } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Building2 className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">Universitet MTB Tizimi</h1>
              <p className="text-xs text-slate-400">Moddiy-texnik baza boshqaruvi</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Buyum topilmadi</h2>
              <p className="text-slate-400">Bu QR kod noto'g'ri yoki buyum tizimdan o'chirilgan bo'lishi mumkin.</p>
            </div>

            <div className="pt-4">
              <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/login">
                  <Home className="h-4 w-4" />
                  Admin panelga kirish
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} Universitet MTB Tizimi</p>
      </footer>
    </div>
  )
}
