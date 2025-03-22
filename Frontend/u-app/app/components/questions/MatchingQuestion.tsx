"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"
import type { Question } from "@/app/utils/interfaces/interfaces"

interface MatchingQuestionProps {
  question: Question
  onAnswer: (matches: { [key: number]: number }) => void
}

export default function MatchingQuestion({ question, onAnswer }: MatchingQuestionProps) {
  // Estado para la opción seleccionada del lado izquierdo
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  // Estado para los pares coincidentes
  const [matches, setMatches] = useState<{ [key: number]: number }>({})
  // Estado para indicar si hay un error en los pares
  const [hasError, setHasError] = useState(false)
  // Estado para mostrar las respuestas correctas
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false)
  // Estados para las opciones de la izquierda y derecha
  const [leftOptions, setLeftOptions] = useState<typeof question.question_option>([])
  const [rightOptions, setRightOptions] = useState<typeof question.question_option>([])
  // Estado para indicar si se ha enviado la respuesta
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Crear arrays de palabras únicas para ambos idiomas
  useEffect(() => {
    // Reducir las opciones para obtener palabras únicas
    const uniqueWords = question.question_option.reduce(
      (acc, curr) => {
        const exists = acc.some((item) => item.word_phrase.id === curr.word_phrase.id)
        if (!exists) {
          acc.push(curr)
        }
        return acc
      },
      [] as typeof question.question_option,
    )

    // Crear copias para izquierda y derecha
    setLeftOptions([...uniqueWords])

    // Barajar el orden de las opciones de la derecha para que no coincidan directamente
    const shuffledRight = [...uniqueWords].sort(() => Math.random() - 0.5)
    setRightOptions(shuffledRight)
  }, [question])

  // Manejar clic en una opción de la izquierda
  const handleLeftClick = (id: number) => {
    // No permitir seleccionar si ya se ha enviado la respuesta
    if (hasSubmitted) return

    setSelectedLeft(id)
    if (hasError) {
      setHasError(false)
    }
  }

  // Manejar clic en una opción de la derecha
  const handleRightClick = (id: number) => {
    // No permitir seleccionar si ya se ha enviado la respuesta
    if (hasSubmitted) return

    if (selectedLeft !== null) {
      // Crear un nuevo par coincidente
      const newMatches = { ...matches, [selectedLeft]: id }
      setMatches(newMatches)
      setSelectedLeft(null)

      // Verificar si todas las palabras están emparejadas
      if (Object.keys(newMatches).length === leftOptions.length) {
        setHasSubmitted(true)

        // Verificar si todos los pares son correctos
        const allCorrect = Object.entries(newMatches).every(([leftId, rightId]) => {
          const leftOption = leftOptions.find((opt) => opt.id === Number.parseInt(leftId))
          const rightOption = rightOptions.find((opt) => opt.id === rightId)
          return leftOption?.word_phrase.id === rightOption?.word_phrase.id
        })

        if (allCorrect) {
          // Notificar al componente padre
          onAnswer(newMatches)
        } else {
          setHasError(true)
          // Mostrar respuestas correctas después de un intento fallido
          setShowCorrectAnswers(true)
          // Notificar al componente padre (respuesta incorrecta)
          onAnswer(newMatches)
        }
      }
    }
  }

  // Reiniciar los pares coincidentes
  const resetMatches = () => {
    setMatches({})
    setSelectedLeft(null)
    setHasError(false)
    setShowCorrectAnswers(false)
    setHasSubmitted(false)
  }

  // Función para continuar después de una respuesta incorrecta
  const handleContinue = () => {
    // Crear un objeto de coincidencias correcto para pasar al componente padre
    const correctMatches: { [key: number]: number } = {}
    leftOptions.forEach((leftOption) => {
      const matchingRight = rightOptions.find((rightOption) => rightOption.word_phrase.id === leftOption.word_phrase.id)
      if (matchingRight) {
        correctMatches[leftOption.id] = matchingRight.id
      }
    })

    // Notificar al componente padre con las coincidencias correctas
    onAnswer(correctMatches)
  }

  // Verificar si una opción ya está emparejada
  const isMatched = (id: number) => Object.keys(matches).includes(id.toString())

  return (
    <div>
      {/* Encabezado con título y botón de reinicio */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium relative group cursor-help">
          {question.text}
          <span className="absolute left-0 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Conecta cada palabra en wayuunaiki con su traducción en español
          </span>
        </h3>
        {(hasError || Object.keys(matches).length > 0) && !hasSubmitted && (
          <Button
            onClick={resetMatches}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-wayuu-red hover:text-wayuu-red/80"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar
          </Button>
        )}
      </div>

      {/* Mensaje de error */}
      {hasError && !showCorrectAnswers && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-red-500 dark:text-red-400 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Algunas parejas no son correctas. Observa las respuestas correctas abajo.
          </p>
        </div>
      )}

      {/* Contenedor de opciones */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Opciones de la izquierda (wayuunaiki) */}
        <div className="space-y-2 flex-1">
          {leftOptions.map((option) => (
            <Button
              key={`left-${option.id}`}
              onClick={() => handleLeftClick(option.id)}
              className={`w-full ${
                selectedLeft === option.id
                  ? "bg-wayuu-blue text-wayuu-sand"
                  : isMatched(option.id)
                    ? "bg-wayuu-teal text-wayuu-navy"
                    : "bg-white text-wayuu-navy"
              } hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80`}
              disabled={isMatched(option.id) || hasSubmitted}
            >
              {option.word_phrase.text_wayuunaiki}
            </Button>
          ))}
        </div>

        {/* Opciones de la derecha (español) */}
        <div className="space-y-2 flex-1">
          {rightOptions.map((option) => (
            <Button
              key={`right-${option.id}`}
              onClick={() => handleRightClick(option.id)}
              className={`w-full ${
                Object.values(matches).includes(option.id)
                  ? "bg-wayuu-teal text-wayuu-navy"
                  : "bg-white text-wayuu-navy"
              } hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80`}
              disabled={Object.values(matches).includes(option.id) || hasSubmitted}
            >
              {option.word_phrase.text_spanish}
            </Button>
          ))}
        </div>
      </div>

      {/* Mostrar respuestas correctas después de un intento fallido */}
      {showCorrectAnswers && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <h4 className="font-medium mb-2 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Respuestas correctas:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {leftOptions.map((leftOption) => {
              const matchingRight = rightOptions.find(
                (rightOption) => rightOption.word_phrase.id === leftOption.word_phrase.id,
              )
              return (
                <div
                  key={`correct-${leftOption.id}`}
                  className="col-span-2 flex justify-between bg-white dark:bg-wayuu-dark-bg p-2 rounded-md"
                >
                  <span className="font-medium">{leftOption.word_phrase.text_wayuunaiki}</span>
                  <span className="text-green-600 dark:text-green-400">→</span>
                  <span className="font-medium">{matchingRight?.word_phrase.text_spanish}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center">
            <Button onClick={handleContinue} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
              Continuar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

