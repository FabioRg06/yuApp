"use client"

import { useState, useEffect } from "react"
import type { Question } from "@/app/utils/interfaces/interfaces"

export function useMatching(question: Question, onAnswer: (matches: { [key: number]: number }) => void) {
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

  return {
    selectedLeft,
    matches,
    hasError,
    showCorrectAnswers,
    leftOptions,
    rightOptions,
    hasSubmitted,
    handleLeftClick,
    handleRightClick,
    resetMatches,
    handleContinue,
    isMatched,
  }
}

