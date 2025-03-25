"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { fetchLessons, updateProgress } from "@/app/services/api/api"
import type { Lesson } from "@/app/utils/interfaces/interfaces"
import { toast } from "react-toastify"
import { useTheme } from "@/app/context/ThemeContext"
// Asegúrate de que esta importación esté correcta
import { useMascot } from "@/app/context/MascotContext"

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
  const { showMessage } = useMascot()

  // Cargar la lección
  const welcomeMessageShownRef = useRef(false)

  useEffect(() => {
    fetchLessons(setLesson, lessonId)

    // Mostrar mensaje de bienvenida solo una vez con 50% de probabilidad
    if (!welcomeMessageShownRef.current && Math.random() < 0.5) {
      welcomeMessageShownRef.current = true
      setTimeout(() => {
        showMessage({
          text: "¡Bienvenido a la lección! Estoy aquí para acompañarte en tu aprendizaje.",
          duration: 6000,
          position: "right",
        })
      }, 1500)
    }
  }, [lessonId, showMessage])

  // Actualizar el progreso cuando cambia
  useEffect(() => {
    if (progress > 0 && lesson) {
      updateProgress(lessonId, progress)

      // Mostrar mensaje de ánimo al alcanzar el 50% de progreso
      if (progress >= 50 && progress < 55) {
        showMessage({
          text: "¡Ya vas por la mitad! Sigue así, lo estás haciendo genial.",
          duration: 5000,
          position: "left",
        })
      }
    }
  }, [lessonId, progress, lesson, showMessage])

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

        // Mostrar mensaje de felicitación al completar la lección
        showMessage({
          text: "¡Felicidades! Has completado la lección con éxito. ¡Sigue practicando!",
          duration: 7000,
          position: "right",
        })
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
       

        // Mensaje para el modo de repaso - Asegurar que este mensaje se muestre
        // Usar setTimeout para asegurar que se muestre después de que el estado se actualice
        setTimeout(() => {
          showMessage({
            text: "Ahora vamos a repasar las preguntas que te resultaron difíciles.",
            duration: 5000,
            position: "left",
          })
        }, 300)
      } else {
        // Si no hay preguntas fallidas, completar la lección
        setLessonCompleted(true)
        setProgress(100)
       

        // Mensaje de felicitación al completar la lección perfectamente
        showMessage({
          text: "¡Increíble! Has completado la lección sin errores. ¡Eres un estudiante excepcional!",
          duration: 7000,
          position: "right",
        })
      }
    } else {
      // Avanzar a la siguiente pregunta normal
      setCurrentQuestionIndex((prev) => prev + 1)

      // Ocasionalmente mostrar un mensaje de ánimo entre preguntas (10% de probabilidad)
      if (Math.random() < 0.1) {
        setTimeout(() => {
          showMessage({
            text: "¡Sigamos adelante! Cada pregunta te acerca más a dominar el wayuunaiki.",
            duration: 4000,
            position: Math.random() > 0.5 ? "right" : "left",
          })
        }, 1000)
      }
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

