"use client"

import { Button } from "@/components/ui/button"
import type { QuestionOption } from "@/app/utils/interfaces/interfaces"

interface MatchingOptionsProps {
  leftOptions: QuestionOption[]
  rightOptions: QuestionOption[]
  selectedLeft: number | null
  isMatched: (id: number) => boolean
  hasSubmitted: boolean
  handleLeftClick: (id: number) => void
  handleRightClick: (id: number) => void
  matchedRightIds: number[]
}

export default function MatchingOptions({
  leftOptions,
  rightOptions,
  selectedLeft,
  isMatched,
  hasSubmitted,
  handleLeftClick,
  handleRightClick,
  matchedRightIds,
}: MatchingOptionsProps) {
  return (
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
              matchedRightIds.includes(option.id) ? "bg-wayuu-teal text-wayuu-navy" : "bg-white text-wayuu-navy"
            } hover:bg-wayuu-blue hover:text-wayuu-sand dark:bg-wayuu-red dark:text-wayuu-dark-text dark:hover:bg-wayuu-red/80`}
            disabled={matchedRightIds.includes(option.id) || hasSubmitted}
          >
            {option.word_phrase.text_spanish}
          </Button>
        ))}
      </div>
    </div>
  )
}

