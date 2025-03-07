import Link from "next/link"
import { Card } from "@/components/ui/card"
import { CheckCircle, Star } from "lucide-react"
import { Lesson } from "@/app/utils/interfaces/interfaces"

interface LessonNodeProps {
  lesson: Lesson
  index: number
}

export default function LessonNode({ lesson, index }: LessonNodeProps) {
  return (
    <Link href={lesson.id ? `/pages/lesson/${lesson.id}` : "#"}>
      <div className="relative">
        <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-wayuu-red text-white flex items-center justify-center text-xs md:text-sm font-bold z-10">
          {index + 1}
        </div>

        {lesson.completed ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-500 text-white flex items-center justify-center z-10">
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        ) : lesson.progress > 0 ? (
          <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-wayuu-teal dark:bg-wayuu-red text-white flex items-center justify-center z-10">
            <Star className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        ) : null}

        <Card className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 
          flex flex-col items-center justify-center 
          transition-all duration-200 hover:scale-110 hover:shadow-lg bg-white dark:bg-wayuu-dark-card ${lesson.completed ? "border-green-500 border-2" : ""}
          overflow-hidden`}>
          <div className="text-2xl sm:text-2xl md:text-3xl mb-1">{lesson.icon}</div>
          <p className="text-xs font-medium text-center text-wayuu-navy dark:text-wayuu-dark-text px-1">{lesson.title}</p>

          {!lesson.completed && lesson.progress > 0 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
              <div className="h-full bg-green-500 dark:bg-green-500" style={{ width: `${lesson.progress}%` }}></div>
            </div>
          )}
        </Card>
      </div>
    </Link>
  )
}
