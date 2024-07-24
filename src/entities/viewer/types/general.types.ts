import { UserDto, UserStatsDto } from '/@src/shared/api/dev-ops-test-api/users/dto/user.dto'

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
export interface ViewerState {
  viewer: UserDto | null
  isInited: boolean
  initialStats: Partial<UserStatsDto>
}
