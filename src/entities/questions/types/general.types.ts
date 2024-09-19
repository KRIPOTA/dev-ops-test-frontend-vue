import { QuestionDto } from '/@src/shared/api/dev-ops-test-api/questions/dto/question.dto'

// export interface OptionQuestionDto {
//   id: number
//   text: string
//   isRight: boolean
// }

// export interface QuestionDto {
//   id: number
//   text: string
//   options: OptionQuestionDto[]
// }

// export interface TestDto {
//   id: number
//   name: string
//   questions: QuestionDto[]
// }

export interface Question extends QuestionDto {
  isAnswerCorrect: boolean | null
}

export interface QuestionsState {
  questions: Question[]
  tab: 'stats' | 'leaders'
  isLoading: boolean
  isAdditionalQuestionsLoaded: boolean
}
