import { CheckCircle, XCircle } from "lucide-react"

interface FeedbackMessageProps {
  isCorrect: boolean
  correctAnswer?: string
}

export default function FeedbackMessage({ isCorrect, correctAnswer }: FeedbackMessageProps) {
  return (
    <div
      className={`mb-4 p-3 rounded-md ${
        isCorrect
          ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          : "bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
      }`}
    >
      {isCorrect ? (
        <p className="text-green-600 dark:text-green-400 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          ¡Correcto!
        </p>
      ) : (
        <p className="text-red-500 dark:text-red-400 flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          Incorrecto. {correctAnswer && `La respuesta correcta es: ${correctAnswer}`}
        </p>
      )}
    </div>
  )
}

