export type ProfessionId = 'frontend' | 'qa' | 'backend'

export type QuestionType = 'single' | 'multiple' | 'text' | 'match'

export interface AnswerOption {
  id: string
  text: string
}

export interface ReferenceLink {
  title: string
  url: string
}

export interface InterviewQuestion {
  id: string
  order: number
  topic: string
  type: QuestionType
  title: string
  options?: AnswerOption[]
  correctAnswer: string | string[]
  hint: string
  explanation: string
  references?: ReferenceLink[]
}

export interface InterviewTest {
  professionId: ProfessionId
  professionTitle: string
  level: 'junior'
  estimatedMinutes: number
  questions: InterviewQuestion[]
}
