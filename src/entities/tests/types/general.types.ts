export interface OptionQuestionDto {
  id: number
  text: string
  isRight: boolean
}

export interface QuestionDto {
  id: number
  text: string
  options: OptionQuestionDto[]
}

export interface TestDto {
  id: number
  name: string
  questions: QuestionDto[]
}

export interface TestsState {
  list: {
    tasks: TestDto[]
  }
  current: {
    item: TestDto | null
  }
}
