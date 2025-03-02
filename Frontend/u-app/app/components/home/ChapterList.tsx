import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ChapterCard from "./ChapterCard"
import LessonCard from "./LessonCard"
import { Chapter } from "@/app/utils/interfaces/interfaces"

interface ChapterListProps {
  chapters: Chapter[]
}

export default function ChapterList({ chapters }: ChapterListProps) {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
          <AccordionTrigger className="bg-white dark:bg-wayuu-dark-card p-4 rounded-t-xl">
            <ChapterCard title={chapter.title} description={chapter.description} progress={chapter.progress} />
          </AccordionTrigger>
          <AccordionContent className="bg-white/90 dark:bg-wayuu-dark-card/90 p-4 rounded-b-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapter.lessons.map((lesson) => (
                <LessonCard
                  key={`lesson-${lesson.id}`}
                  title={lesson.title}
                  description={lesson.description}
                  progress={lesson.progress}
                  href={`/pages/lesson/${lesson.id}`}
                  icon={lesson.icon}
                  completed={lesson.completed}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
