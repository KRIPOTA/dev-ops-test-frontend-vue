import { CreateQuestionDto } from './create-question.dto'

export interface UpdateQuestionDto extends CreateQuestionDto {
  _id: string
}
