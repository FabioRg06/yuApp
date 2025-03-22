"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { fetchLessons, updateProgress } from "@/app/services/api/api"
import type { Lesson } from "@/app/utils/interfaces/interfaces"
import { toast } from "react-toastify"
import { useTheme } from "@/app/context/ThemeContext"

export function useLesson(lessonId: string) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [failedQuestions, setFailedQuestions] = useState<number[]>([])
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const { theme } = useTheme()

  // Cargar la lección
  useEffect(() => {
    fetchLessons(setLesson, lessonId)
  }, [lessonId])

  // Actualizar el progreso cuando cambia
  useEffect(() => {
    if (progress > 0 && lesson) {
      updateProgress(lessonId, progress)
    }
  }, [lessonId, progress, lesson])

  // Función para manejar el avance a la siguiente pregunta
  const moveToNextQuestion = () => {
    if (!lesson) return

    // Si estamos en modo de repaso, seguir con las preguntas fallidas
    if (isReviewMode) {
      if (failedQuestions.length > 0) {
        // Tomar la primera pregunta fallida y eliminarla de la lista
        const nextFailedIndex = failedQuestions[0]
        setFailedQuestions(failedQuestions.slice(1))
        setCurrentQuestionIndex(nextFailedIndex)
      } else {
        // Si no hay más preguntas fallidas, completar la lección
        setLessonCompleted(true)
        setProgress(100)
        toast.success("¡Lección completada!", { theme: theme === "dark" ? "dark" : "light" })
      }
      return
    }

    // Si estamos en la última pregunta normal
    if (currentQuestionIndex >= lesson.questions.length - 1) {
      // Si hay preguntas fallidas, entrar en modo de repaso
      if (failedQuestions.length > 0) {
        setIsReviewMode(true)
        const nextFailedIndex = failedQuestions[0]
        setFailedQuestions(failedQuestions.slice(1))
        setCurrentQuestionIndex(nextFailedIndex)
        toast.info("Vamos a repasar las preguntas que fallaste", { theme: theme === "dark" ? "dark" : "light" })
      } else {
        // Si no hay preguntas fallidas, completar la lección
        setLessonCompleted(true)
        setProgress(100)
        toast.success("¡Lección completada!", { theme: theme === "dark" ? "dark" : "light" })
      }
    } else {
      // Avanzar a la siguiente pregunta normal
      setCurrentQuestionIndex((prev) => prev + 1)
    }

    // Actualizar el progreso
    const newProgress = Math.min(((currentQuestionIndex + 1) / lesson.questions.length) * 100, 100)
    setProgress(newProgress)
  }

  // Función principal para manejar el resultado de una respuesta
  const handleAnswerResult = (isCorrect: boolean) => {
    // Evitar procesamiento múltiple de respuestas
    if (isProcessingAnswer || !lesson) return
    setIsProcessingAnswer(true)

    if (isCorrect) {
      // Incrementar contador de respuestas correctas
      setCorrectAnswers((prev) => prev + 1)

      // Si estamos en modo de repaso, eliminar esta pregunta de las fallidas
      if (isReviewMode) {
        setFailedQuestions((prev) => prev.filter((idx) => idx !== currentQuestionIndex))
      }

      // Esperar un momento antes de avanzar
      setTimeout(() => {
        moveToNextQuestion()
        setIsProcessingAnswer(false)
      }, 1500)
    } else {
      // Marcar la pregunta como fallida si no está ya en la lista y no estamos en modo de repaso
      if (!isReviewMode && !failedQuestions.includes(currentQuestionIndex)) {
        setFailedQuestions((prev) => [...prev, currentQuestionIndex])
      }

      toast.error("Intenta de nuevo", { theme: theme === "dark" ? "dark" : "light" })
      setIsProcessingAnswer(false)

      // No avanzamos automáticamente - el usuario debe hacer clic en "Continuar"
      // El botón "Continuar" llamará a onAnswer con la respuesta correcta
    }
  }

  // Manejadores para diferentes tipos de preguntas
  const handleMultipleChoiceAnswer = (answerId: number) => {
    if (!lesson) return

    const currentQuestion = lesson.questions[currentQuestionIndex]
    const isCorrect = currentQuestion.question_option.find((opt) => opt.id === answerId)?.is_correct

    handleAnswerResult(isCorrect || false)
  }

  const handleTranslationAnswer = (answer: string) => {
    if (!lesson) return

    const currentQuestion = lesson.questions[currentQuestionIndex]
    const correctAnswer = currentQuestion.question_option[0].word_phrase
    const isCorrect =
      answer.toLowerCase() === correctAnswer.text_spanish.toLowerCase() ||
      answer.toLowerCase() === correctAnswer.text_wayuunaiki.toLowerCase()

    handleAnswerResult(isCorrect)
  }

  const handleMatchingAnswer = (matches: { [key: number]: number }) => {
    if (!lesson) return

    const currentQuestion = lesson.questions[currentQuestionIndex]
    // Verificar si los pares coincidentes tienen el mismo word_phrase.id
    const isCorrect = Object.entries(matches).every(([leftId, rightId]) => {
      const leftOption = currentQuestion.question_option.find((opt) => opt.id === Number.parseInt(leftId))
      const rightOption = currentQuestion.question_option.find((opt) => opt.id === rightId)
      return leftOption?.word_phrase.id === rightOption?.word_phrase.id
    })

    handleAnswerResult(isCorrect)
  }

  return {
    lesson,
    currentQuestionIndex,
    progress,
    lessonCompleted,
    correctAnswers,
    isProcessingAnswer,
    isReviewMode,
    handleMatchingAnswer,
    handleTranslationAnswer,
    handleMultipleChoiceAnswer,
  }
}

