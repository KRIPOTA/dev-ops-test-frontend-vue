export interface CreateQuestionDto {
  question: string
  answers: string[]
  correctAnswerIndex: number
  explanation?: string
  datePublishEveryDay?: Date | null
  countPublish?: number
  countTrueAnswer?: number
  tags?: string[]
}
