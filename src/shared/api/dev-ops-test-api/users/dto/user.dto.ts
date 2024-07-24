export interface UserStatsDto {
  userId: number
  questionsAnswer: number
  questionsAnswerTrue: number
  loginCountDays: number
  loginLast: Date | null
}

export interface UserDto {
  tgId: number
  isBot: boolean
  firstName: string
  lastName: string
  username: string
  photoUrl: string
  stats: UserStatsDto
}
