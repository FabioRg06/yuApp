import { Progress } from "@/components/ui/progress"

interface ChapterCardProps {
  title: string
  description: string
  progress: number
}

export default function ChapterCard({ title, description, progress }: ChapterCardProps) {
  return (
    <div className="mb-6 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-wayuu-red font-display text-center sm:text-left">
          {title}
        </h2>
      </div>
      <p className="text-wayuu-navy dark:text-wayuu-dark-text mt-2 text-center sm:text-left">
        {description}
      </p>

     < Progress value={progress} className=" mt-3 mx-auto sm:mx-0  bg-wayuu-teal dark:bg-wayuu-red h-2 w-full max-w-xs" />
    </div>
  )
}


