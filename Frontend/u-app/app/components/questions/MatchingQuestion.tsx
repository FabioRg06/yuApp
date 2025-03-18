"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { Question } from "@/app/utils/interfaces/interfaces"

interface MatchingQuestionProps {
  question: Question
  onAnswer: (matches: { [key: number]: number }) => void
}

export default function MatchingQuestion({ question, onAnswer }: MatchingQuestionProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matches, setMatches] = useState<{ [key: number]: number }>({})
  const [hasError, setHasError] = useState(false)
  const [hoverWordId, setHoverWordId] = useState<number | null>(null)

  // Create arrays of unique words for both languages
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

  const handleLeftClick = (id: number) => {
    setSelectedLeft(id)
    if (hasError) {
      setHasError(false)
    }
  }

  const handleRightClick = (id: number) => {
    if (selectedLeft !== null) {
      const newMatches = { ...matches, [selectedLeft]: id }
      setMatches(newMatches)
      setSelectedLeft(null)

      // Check if all words are matched
      if (Object.keys(newMatches).length === uniqueWords.length) {
        // Verify if all matches are correct
        const allCorrect = Object.entries(newMatches).every(([leftId, rightId]) => {
          const leftOption = question.question_option.find((opt) => opt.id === Number.parseInt(leftId))
          const rightOption = question.question_option.find((opt) => opt.id === rightId)
          return leftOption?.word_phrase.id === rightOption?.word_phrase.id
        })

        if (allCorrect) {
          onAnswer(newMatches)
        } else {
          setHasError(true)
        }
      }
    }
  }

  const resetMatches = () => {
    setMatches({})
    setSelectedLeft(null)
    setHasError(false)
  }

  const isMatched = (id: number) => Object.keys(matches).includes(id.toString())

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium relative group cursor-help">
          {question.text}
          <span className="absolute left-0 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            Conecta cada palabra en wayuunaiki con su traducción en español
          </span>
        </h3>
        {(hasError || Object.keys(matches).length > 0) && (
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
      {hasError && (
        <p className="text-red-500 dark:text-red-400 mb-4">Algunas parejas no son correctas. ¡Inténtalo de nuevo!</p>
      )}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2 flex-1">
          {uniqueWords.map((option) => (
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
              disabled={isMatched(option.id)}
            >
              {option.word_phrase.text_wayuunaiki}
            </Button>
          ))}
        </div>
        <div className="space-y-2 flex-1">
          {uniqueWords.map((option) => (
            <Button
              key={`right-${option.id}`}
              onClick={() => handleRightClick(option.id)}
              className={`w-full ${
                Object.values(matches).includes(option.id)
                  ? "bg-wayuu-teal text-wayuu-navy"
                  : "bg-white text-wayuu-navy"
              } hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80`}
              disabled={Object.values(matches).includes(option.id)}
            >
              {option.word_phrase.text_spanish}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
