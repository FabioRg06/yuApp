import { Heart, Star, FlameIcon as Fire } from "lucide-react"

interface ProgressStatsProps {
  hearts: number
  points: number
  streak: number
}

export default function ProgressStats({ hearts, points, streak }: ProgressStatsProps) {
  return (
    <div className="flex items-center gap-6 px-4">
      <div className="flex items-center gap-1">
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        <span className="font-bold text-wayuu-navy dark:text-wayuu-dark-text">{hearts}</span>
      </div>

      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        <span className="font-bold text-wayuu-navy dark:text-wayuu-dark-text">{points}</span>
      </div>

      <div className="flex items-center gap-1">
        <Fire className="w-5 h-5 text-orange-500 fill-orange-500" />
        <span className="font-bold text-wayuu-navy dark:text-wayuu-dark-text">{streak}</span>
      </div>
    </div>
  )
}
