"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, GraduationCap,MessageSquare, HelpCircle, LayoutDashboard, Settings } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/pages/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Estadísticas",
    href: "/pages/admin/stats",
    icon: BarChart3,
  },
  {
    title: "Capítulos",
    href: "/pages/admin/chapters",
    icon: BookOpen,
  },
  {
    title: "Lecciones",
    href: "/pages/admin/lessons",
    icon: GraduationCap,
  },
  {
    title: "Palabras/Frases",
    href: "/pages/admin/words",
    icon: MessageSquare,
  },
  {
    title: "Ayuda",
    href: "/pages/admin/help",
    icon: HelpCircle,
  },
  {
    title: "Configuración",
    href: "/pages/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <nav className="w-64 min-h-[calc(100vh-4rem)] border-r bg-white dark:bg-wayuu-dark-card px-3 py-4">
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-wayuu-red text-white dark:bg-wayuu-red dark:text-white"
                : "text-muted-foreground hover:bg-wayuu-sand dark:hover:bg-wayuu-dark-bg",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>
    </nav>
  )
}

