export interface UpdateUserStatsDto {
  userId: number
  questionsAnswer?: number
  questionsAnswerTrue?: number
  loginCountDays?: number
  loginLast?: Date | null
}
