"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchLessons,updateProgress } from "@/app/utils/api"
import { Lesson } from "@/app/utils/interfaces/interfaces"
import { withAuth } from "@/app/utils/withAuth"
// Sample lesson data (you would fetch this from an API in a real application)


function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isLessonComplete, setIsLessonComplete] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)


  useEffect(() => {
    
    fetchLessons(setLesson,params.id)
  }, [])
  
  const handleAnswer = (answerId: number) => {
    if (!lesson) return

    const currentQuestion = lesson.questions[currentQuestionIndex]
    if (answerId === currentQuestion.correct_answer.id) {
      setCorrectAnswers(correctAnswers + 1)
      toast.success("¡Correcto! 🎉", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      if (currentQuestionIndex < lesson.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setIsLessonComplete(true)
      }
      setProgress(((currentQuestionIndex + 1) / lesson.questions.length) * 100)
      updateProgress(params.id,progress)
    } else {
      toast.error("Intenta de nuevo 😊", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  if (!lesson) {
    return <div>Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-navy text-wayuu-navy dark:text-wayuu-sand">
      <header className="bg-white dark:bg-wayuu-blue shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/home" className="text-wayuu-red hover:underline flex items-center">
            <ArrowLeft className="mr-2" /> Volver a los capítulos
          </Link>
          <div>
            <h2 className="text-lg font-medium text-wayuu-navy dark:text-wayuu-sand">Capítulo {lesson.chapter}</h2>
            <h1 className="text-2xl font-bold font-display text-wayuu-red">{lesson.title}</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/80 dark:bg-wayuu-blue/80 backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-wayuu-red">
              <span className="text-3xl mr-2">{lesson.icon}</span>
              {lesson.description}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4 bg-wayuu-teal" />
            {!isLessonComplete ? (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {lesson.questions[currentQuestionIndex].question_type.text}
                  <span className="font-bold">
                    {" "}
                    {lesson.questions[currentQuestionIndex].correct_answer.text_wayuunaiki}
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lesson.questions[currentQuestionIndex].options.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className="bg-wayuu-teal text-wayuu-navy hover:bg-wayuu-blue hover:text-wayuu-sand"
                    >
                      {option.text_spanish}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">¡Felicidades!</h3>
                <p className="mb-4">Has completado esta lección.</p>
                <p className="mb-4">
                  Respondiste correctamente {correctAnswers} de {lesson.questions.length} preguntas.
                </p>
                <Progress value={(correctAnswers / lesson.questions.length) * 100} className="mb-4 bg-wayuu-teal" />
                <Button
                  onClick={() => router.push("/home")}
                  className="bg-wayuu-red hover:bg-wayuu-blue text-wayuu-sand"
                >
                  Volver a los capítulos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
export default withAuth(LessonPage)
