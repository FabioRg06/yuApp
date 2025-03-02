import { Progress } from "@/components/ui/progress"

interface ChapterCardProps {
  title: string
  description: string
  progress: number
}

export default function ChapterCard({ title, description, progress }: ChapterCardProps) {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-wayuu-red font-display mb-2">{title}</h3>
      <p className="text-sm text-wayuu-navy dark:text-wayuu-dark-text mb-2">{description}</p>
      <div className="flex items-center">
        <Progress value={progress} className="flex-grow bg-wayuu-teal dark:bg-wayuu-red" />
        <span className="ml-2 text-sm font-medium text-wayuu-navy dark:text-wayuu-dark-text">{progress}%</span>
      </div>
    </div>
  )
}


