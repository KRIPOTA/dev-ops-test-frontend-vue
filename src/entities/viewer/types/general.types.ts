export interface TgUserDto {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

export interface StatQuestionDto {
  id: number
  chooseOptionId: number
}

export interface StatDto {
  taskId: number
  questions: StatQuestionDto[]
}

export interface ViewerDto {
  id: number
  externalId: number
  externalUserName: string
  firstName: string
  lastName: string
  stats: StatDto[]
}

export interface ViewerState {
  viewer: ViewerDto | null
}
