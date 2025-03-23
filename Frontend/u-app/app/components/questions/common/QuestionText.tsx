"use client"

interface QuestionTextProps {
  text: string
  wordToTranslate: string
  translation: string
  showTranslation?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onTouchStart?: () => void
}

export default function QuestionText({
  text,
  wordToTranslate,
  translation,
  showTranslation,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
}: QuestionTextProps) {
  return (
    <h3 className="text-lg font-medium mb-4">
      {text}{" "}
      <span
        className="font-bold relative group cursor-help border-b border-dotted border-wayuu-red"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        title={translation}
      >
        {/* Palabra a traducir */}
        {wordToTranslate}

        {/* Tooltip con la traducción */}
        <span
          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-auto p-2 bg-wayuu-navy dark:bg-wayuu-dark-card text-white dark:text-wayuu-dark-text text-sm rounded-md transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap ${
            showTranslation ? "opacity-100" : "opacity-0"
          }`}
        >
          {translation}
        </span>
      </span>
    </h3>
  )
}

