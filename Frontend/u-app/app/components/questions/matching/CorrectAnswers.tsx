"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QuestionOption } from "@/app/utils/interfaces/interfaces"

interface CorrectAnswersProps {
  leftOptions: QuestionOption[]
  rightOptions: QuestionOption[]
  onContinue: () => void
  onReset: () => void
}

export default function CorrectAnswers({ leftOptions, rightOptions, onContinue, onReset }: CorrectAnswersProps) {
  return (
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
        <Button onClick={onContinue} className="bg-wayuu-red hover:bg-wayuu-red/80 text-white">
          Continuar
        </Button>
      </div>
    </div>
  )
}

