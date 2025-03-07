import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ChapterCard from "./ChapterCard"
import { Chapter } from "@/app/utils/interfaces/interfaces"
import { BookOpen } from "lucide-react"
import LessonPath from "./LessonPath"

interface ChapterListProps {
  chapters: Chapter[]
}

export default function ChapterList({ chapters }: ChapterListProps) {
  return (
    <div className="flex flex-col gap-12">
    {chapters.map((chapter, index) => (
      <div key={chapter.id} className="mb-8">
        {/* Fondo decorativo para cada capítulo */}
        <div className="relative bg-gradient-to-r from-wayuu-teal/10 to-wayuu-blue/10 dark:from-wayuu-red/10 dark:to-wayuu-navy/20 rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="absolute top-4 right-4 opacity-10 hidden sm:block">
            <BookOpen className="h-16 w-16 text-wayuu-red dark:text-wayuu-red" />
          </div>

          <ChapterCard 
            title={chapter.title} 
            description={chapter.description} 
            progress={chapter.progress}/>

          <div className="p-2">
            <LessonPath lessons={chapter.lessons} />
          </div>
        </div>
      </div>
    ))}
  </div>
  )
}
