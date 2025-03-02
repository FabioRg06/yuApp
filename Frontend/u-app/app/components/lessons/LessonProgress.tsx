import { Progress } from "@/components/ui/progress"

export default function LessonProgress({ value }: { value: number }) {
  return <Progress value={value} className="mb-4 bg-wayuu-teal dark:bg-wayuu-red" />
}
