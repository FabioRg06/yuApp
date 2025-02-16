"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import LessonCard from "../components/LessonCard"
import ChapterCard from "../components/ChapterCard"
import Link from "next/link"
import { Sun, Moon, Volume2, LogOut } from "lucide-react"
import { withAuth } from "../utils/withAuth";
import { fetchChapters } from "../utils/api"
import { Chapter} from "../utils/interfaces/interfaces"


function Home() {
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  useEffect(() => {
    
    fetchChapters(setChapters)
  }, [])
  
  const handleLogout = () => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push("/")
  }

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-navy text-wayuu-navy dark:text-wayuu-sand">
      <header className="bg-white dark:bg-wayuu-blue shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold font-display text-wayuu-red">YU</h1>
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
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/80 dark:bg-wayuu-blue/80 backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4 text-wayuu-red font-display">
            Welcome to your Wayuu adventure!
            </h2>
            <p className="text-wayuu-navy dark:text-wayuu-sand">
            Explore our chapters and lessons to learn the beautiful Wayuu dialect.
            </p>
          </CardContent>
        </Card>
        <Accordion type="single" collapsible className="space-y-4">
          {chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
              <AccordionTrigger className="bg-white dark:bg-wayuu-blue p-4 rounded-t-xl">
                <ChapterCard title={chapter.title} description={chapter.description} progress={chapter.progress} />
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 dark:bg-wayuu-blue/90 p-4 rounded-b-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.lessons.map((lesson) => (
                    <LessonCard
                    key={`lesson-${lesson.id}`}
                    title={lesson.title}
                    description={lesson.description}
                    progress={lesson.progress}
                    href={`/lesson/${lesson.id}`}
                    icon={lesson.icon}
                  />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}

export default withAuth(Home)