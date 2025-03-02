import { CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LessonCompletion({ correctAnswers, totalQuestions }: { correctAnswers: number; totalQuestions: number }) {
  const router = useRouter()

  return (
    <div className="text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400 mb-4" />
      <h3 className="text-2xl font-bold mb-4">¡Felicidades!</h3>
      <p className="mb-4">Has completado esta lección.</p>
      <p className="mb-4">
        Respondiste correctamente {correctAnswers} de {totalQuestions} preguntas.
      </p>
      <Progress value={(correctAnswers / totalQuestions) * 100} className="mb-4 bg-wayuu-teal dark:bg-wayuu-red" />
      <Button onClick={() => router.push("/pages/home")} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
        Volver a los capítulos
      </Button>
    </div>
  )
}
