"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LessonCard from "../components/LessonCard"
import { Sun, Moon, Volume2, LogOut } from "lucide-react"
import { withAuth } from "../utils/withAuth";

function Home() {
  const router = useRouter()

  const handleLogout = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push("/")
  }

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-navy text-wayuu-navy dark:text-wayuu-sand">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold font-display text-wayuu-red">WayuuLingua</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Cambiar tema</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand"
          >
            <Volume2 className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Activar/Desactivar sonido</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand"
            onClick={handleLogout}
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/80 dark:bg-wayuu-blue/80 backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-wayuu-red font-display">
              ¡Bienvenido a tu aventura Wayuu!
            </h2>
            <p className="text-wayuu-navy dark:text-wayuu-sand">
              Explora nuestra colección de lecciones divertidas y aprende el hermoso idioma Wayuu.
            </p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LessonCard
            title="Saludos básicos"
            description="Aprende a saludar en Wayuu"
            progress={0}
            href="/lesson/1"
            icon="👋"
          />
          <LessonCard title="Números" description="Cuenta en Wayuu" progress={0} href="/lesson/2" icon="🔢" />
          <LessonCard
            title="Familia"
            description="Aprende palabras relacionadas con la familia"
            progress={0}
            href="/lesson/3"
            icon="👨‍👩‍👧‍👦"
          />
        </div>
      </main>
    </div>
  )
}

export default withAuth(Home)