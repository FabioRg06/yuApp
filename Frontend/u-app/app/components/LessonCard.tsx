import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface LessonCardProps {
  title: string
  description: string
  progress: number
  href: string
  icon: string
  completed:boolean
}

export default function LessonCard({ title, description, progress, href, icon,completed }: LessonCardProps) {
  return (
    <Link href={href}>
      <Card
        className={`hover:shadow-lg transition-shadow duration-300 h-full relative ${
          completed ? "bg-green-50 dark:bg-green-900/20" : "bg-white dark:bg-wayuu-dark-bg"
        }`}
      >
        {completed && (
          <div className="absolute top-2 right-2 text-green-500 dark:text-green-400">
            <CheckCircle className="h-6 w-6" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center text-wayuu-red font-display text-lg">
            <span className="text-4xl mr-2">{icon}</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-wayuu-navy dark:text-wayuu-dark-text mb-2">{description}</p>
          <div className="flex items-center">
            <Progress value={progress} className="flex-grow bg-wayuu-teal dark:bg-wayuu-red" />
            <span className="ml-2 text-sm font-medium text-wayuu-navy dark:text-wayuu-dark-text">{progress}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

