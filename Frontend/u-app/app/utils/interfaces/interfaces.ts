export interface Chapter {
  id: number
  title: string
  description: string
  created_at:string
  progress: number
  lessons: Lesson[]
}


export interface WordPhrase {
  id: number
  text_wayuunaiki: string
  text_spanish: string
  type: string
  is_known: boolean
  tags: string[]
}

export interface QuestionOption {
  id: number
  question_option: number
  word_phrase: WordPhrase
  is_correct: boolean
}

export interface QuestionType {
  id: number
  name: string
  description: string | null
}

export interface Question {
  id: number
  lesson: number
  question_type: QuestionType
  text: string
  question_option: QuestionOption[]
}

export interface Lesson {
  id: number
  title: string
  chapter: number
  description: string
  icon: string
  created_at: string
  progress: number
  questions: Question[]
  completed: boolean
}
