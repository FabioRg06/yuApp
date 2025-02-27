"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchLessons,updateProgress } from "@/app/services/api/api"
import type { Lesson,Question } from "@/app/utils/interfaces/interfaces"
import { withAuth } from "@/app/utils/withAuth"
import { useTheme } from "@/app/context/ThemeContext"
import MultipleChoiceQuestion from "@/app/components/MultipleChoiceQuestion"
import TranslationQuestion from "@/app/components/TranslationQuestion"
import MatchingQuestion from "@/app/components/MatchingQuestion"



function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const { theme } = useTheme()


  useEffect(() => {
    
    fetchLessons(setLesson,params.id)
    updateProgress(params.id, progress);
  }, [params.id,progress])
  
  const handleMultipleChoiceAnswer = (answerId: number) => {
    const currentQuestion = lesson!.questions[currentQuestionIndex]
    const isCorrect = currentQuestion.question_option.find((opt) => opt.id === answerId)?.is_correct

    handleAnswerResult(isCorrect || false)
  }

  const handleTranslationAnswer = (answer: string) => {
    const currentQuestion = lesson!.questions[currentQuestionIndex]
    const correctAnswer = currentQuestion.question_option[0].word_phrase
    const isCorrect =
      answer.toLowerCase() === correctAnswer.text_spanish.toLowerCase() ||
      answer.toLowerCase() === correctAnswer.text_wayuunaiki.toLowerCase()

    handleAnswerResult(isCorrect)
  }

  const handleMatchingAnswer = (matches: { [key: number]: number }) => {
    const currentQuestion = lesson!.questions[currentQuestionIndex]
    // Check if the matched pairs have the same word_phrase.id
    const isCorrect = Object.entries(matches).every(([leftId, rightId]) => {
      const leftOption = currentQuestion.question_option.find((opt) => opt.id === Number.parseInt(leftId))
      const rightOption = currentQuestion.question_option.find((opt) => opt.id === rightId)
      return leftOption?.word_phrase.id === rightOption?.word_phrase.id
    })

    handleAnswerResult(isCorrect)
  }

  const handleAnswerResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1)
      toast.success("¡Correcto! 🎉", {
        theme: theme === "dark" ? "dark" : "light",
      })
      if (currentQuestionIndex < lesson!.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setLessonCompleted(true)
        setProgress(100)
      }
      const newProgress = ((currentQuestionIndex + 1) / lesson!.questions.length) * 100
      setProgress(newProgress)
      //updateProgress(params.id, newProgress);
    } else {
      toast.error("Intenta de nuevo 😊", {
        theme: theme === "dark" ? "dark" : "light",
      })
    }
  }

  const renderQuestion = (question: Question) => {
    switch (question.question_type.name) {
      case "multiple selection":
        return <MultipleChoiceQuestion question={question} onAnswer={handleMultipleChoiceAnswer} />
      case "translation":
        return <TranslationQuestion question={question} onAnswer={handleTranslationAnswer} />
      case "matching":
        return <MatchingQuestion question={question} onAnswer={handleMatchingAnswer} />
      default:
        return <div>Tipo de pregunta no soportado</div>
    }
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-6">
            <p className="text-wayuu-navy dark:text-wayuu-dark-text mb-4">
              No se pudo cargar la lección. Por favor, intenta de nuevo.
            </p>
            <Button onClick={() => router.push("/home")} className="bg-wayuu-red text-white hover:bg-wayuu-red/80">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wayuu-sand dark:bg-wayuu-dark-bg text-wayuu-navy dark:text-wayuu-dark-text">
      <header className="bg-white dark:bg-wayuu-dark-card shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/home" className="text-wayuu-red hover:underline flex items-center">
            <ArrowLeft className="mr-2" /> Volver a los capítulos
          </Link>
          <div>
            <h2 className="text-lg font-medium text-wayuu-navy dark:text-wayuu-dark-text">Capítulo {lesson.chapter}</h2>
            <h1 className="text-2xl font-bold font-display text-wayuu-red">{lesson.title}</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white/80 dark:bg-wayuu-dark-card backdrop-blur-sm mb-8 p-6 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-wayuu-red">
              <span className="text-3xl mr-2">{lesson.icon}</span>
              {lesson.description}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4 bg-wayuu-teal dark:bg-wayuu-red" />
            {!lessonCompleted ? (
              renderQuestion(lesson.questions[currentQuestionIndex])
            ) : (
              <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 dark:text-green-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">¡Felicidades!</h3>
                <p className="mb-4">Has completado esta lección.</p>
                <p className="mb-4">
                  Respondiste correctamente {correctAnswers} de {lesson.questions.length} preguntas.
                </p>
                <Progress
                  value={(correctAnswers / lesson.questions.length) * 100}
                  className="mb-4 bg-wayuu-teal dark:bg-wayuu-red"
                />
                <Button
                  onClick={() => router.push("/home")}
                  className="bg-wayuu-red hover:bg-wayuu-red/80 text-white dark:bg-wayuu-red dark:hover:bg-wayuu-red/80 dark:text-wayuu-dark-text"
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
