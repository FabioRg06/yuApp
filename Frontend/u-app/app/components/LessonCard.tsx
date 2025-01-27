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
      <Card className="hover:shadow-lg transition-shadow duration-300 bg-white/90 dark:bg-wayuu-blue/90 backdrop-blur-sm border-2 border-wayuu-teal">
        <CardHeader>
          <CardTitle className="flex items-center text-wayuu-red font-display">
            <span className="text-4xl mr-2">{icon}</span>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-wayuu-navy dark:text-wayuu-sand mb-4">{description}</p>
          <Progress value={progress} className="w-full bg-wayuu-teal" />
        </CardContent>
      </Card>
    </Link>
  )
}

