import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface LessonCardProps {
  title: string
  description: string
  progress: number
  href: string
  icon: string
}

export default function LessonCard({ title, description, progress, href, icon }: LessonCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full dark:bg-wayuu-dark-bg">
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

