export interface QuestionDto {
  _id: string
  question: string
  answers: string[]
  correctAnswerIndex: number
  explanation: string
  dateInsert: Date
  datePublishEveryDay: Date | null
  countPublish: number
  countTrueAnswer: number
  tags: string[]
}
