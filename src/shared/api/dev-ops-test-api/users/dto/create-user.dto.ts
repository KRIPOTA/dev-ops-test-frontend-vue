export interface CreateUserDto {
  tgId: number
  isBot?: boolean
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
}
