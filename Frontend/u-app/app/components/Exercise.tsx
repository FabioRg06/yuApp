import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ExerciseProps {
  question: string
  options: string[]
  onAnswer: (answer: string) => void
}

export default function Exercise({ question, options, onAnswer }: ExerciseProps) {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-orange-600 dark:text-yellow-300">{question}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onAnswer(option)}
            variant="outline"
            className="bg-orange-100 hover:bg-orange-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-orange-600 dark:text-yellow-300 border-orange-300 dark:border-purple-600"
          >
            {option}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

