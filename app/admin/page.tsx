import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ClipboardList, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const [totalAssets, totalEmployees, activeAssignments, recentAssets] = await Promise.all([
    prisma.asset.count(),
    prisma.employee.count(),
    prisma.assetAssignment.count({ where: { isActive: true } }),
    prisma.asset.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
  ])

  const stats = [
    {
      title: "Jami Buyumlar",
      value: totalAssets,
      icon: Package,
      description: "Barcha buyumlar soni",
    },
    {
      title: "Jami Hodimlar",
      value: totalEmployees,
      icon: Users,
      description: "Ro'yxatga olingan hodimlar",
    },
    {
      title: "Aktiv Javobgarliklar",
      value: activeAssignments,
      icon: ClipboardList,
      description: "Hozirda biriktirilgan",
    },
    {
      title: "Yangi (30 kun)",
      value: recentAssets,
      icon: TrendingUp,
      description: "Oxirgi oy qo'shilganlar",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Tizim statistikasi va umumiy ma'lumotlar</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xush kelibsiz!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Universitet Moddiy-Texnik Baza Boshqarish Tizimiga xush kelibsiz. Yuqoridagi menyudan kerakli bo'limni
            tanlang.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Hodimlar bo'limida yangi xodimlarni qo'shing va boshqaring</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Buyumlar bo'limida inventar ro'yxatini yuritng</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Har bir buyumga avtomatik QR kod yaratiladi</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Excel eksport orqali hisobotlar yuklab oling</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
