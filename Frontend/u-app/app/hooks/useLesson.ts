import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchLessons, updateProgress } from "@/app/services/api/api"
import type { Lesson, Question } from "@/app/utils/interfaces/interfaces"
import { toast } from "react-toastify"
import { useTheme } from "@/app/context/ThemeContext"

export function useLesson(lessonId: string) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const { theme } = useTheme()

  useEffect(() => {
    fetchLessons(setLesson, lessonId)
    updateProgress(lessonId, progress)
  }, [lessonId, progress])

  const handleAnswerResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      toast.success("¡Correcto! 🎉", { theme: theme === "dark" ? "dark" : "light" })

      if (currentQuestionIndex < lesson!.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setLessonCompleted(true)
        setProgress(100)
      }

      setProgress(((currentQuestionIndex + 1) / lesson!.questions.length) * 100)
    } else {
      toast.error("Intenta de nuevo 😊", { theme: theme === "dark" ? "dark" : "light" })
    }
  }
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
  return {
    lesson,
    question,
    currentQuestionIndex,
    progress,
    lessonCompleted,
    correctAnswers,
    handleMatchingAnswer,
    handleTranslationAnswer,
    handleMultipleChoiceAnswer
  }
}
