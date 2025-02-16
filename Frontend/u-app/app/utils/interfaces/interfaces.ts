
export interface Chapter {
    id: number
    title: string
    description: string
    progress: number
    lessons: Lesson[]
  }
export interface QuestionType {
    id: number
    name: string
    text: string
  }
  
export interface Option {
    id: number
    text_wayuunaiki: string
    text_spanish: string
    is_known: boolean
    lesson: number
  }
  
export interface Question {
    id: number
    question_type: QuestionType
    correct_answer: Option
    options: Option[]
    lesson: number
  }
  
export interface Lesson {
    id:number
    title: string
    chapter: number
    description: string
    icon: string
    created_at: string
    progress: number
    questions: Question[]
  }
  