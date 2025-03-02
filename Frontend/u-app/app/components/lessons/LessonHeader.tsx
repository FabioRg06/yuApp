import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LessonHeader({ chapter, title }: { chapter: number; title: string }) {
  return (
    <header className="bg-white dark:bg-wayuu-dark-card shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/pages/home" className="text-wayuu-red hover:underline flex items-center">
          <ArrowLeft className="mr-2" /> Volver a los capítulos
        </Link>
        <div>
          <h2 className="text-lg font-medium text-wayuu-navy dark:text-wayuu-dark-text">Capítulo {chapter}</h2>
          <h1 className="text-2xl font-bold font-display text-wayuu-red">{title}</h1>
        </div>
      </div>
    </header>
  )
}
