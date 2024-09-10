import { DEV_OPS_TEST_API } from '../api'
import { CreateQuestionDto, UpdateQuestionDto } from './dto'
import { QuestionDto } from './dto/question.dto'

export * from './dto'

export const questions = {
  async get(limit = 20) {
    return DEV_OPS_TEST_API.get<QuestionDto[]>(`questions?limit=${limit}`).then((response) => response?.data)
  },

  async getByDate() {
    return DEV_OPS_TEST_API.get<QuestionDto[]>('questions/by-date').then((response) => response?.data)
  },

  async create(dto: CreateQuestionDto) {
    return DEV_OPS_TEST_API.post<QuestionDto>('questions', dto).then((response) => response?.data)
  },

  async update(dto: UpdateQuestionDto[]) {
    return DEV_OPS_TEST_API.patch<QuestionDto[]>('questions', dto).then((response) => response?.data)
  },
}
