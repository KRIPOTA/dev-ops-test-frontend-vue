import { DEV_OPS_TEST_API } from '../api'
import { CreateUserDto, UpdateUserStatsDto } from './dto'
import { UserDto, UserStatsDto } from './dto/user.dto'

export * from './dto'

export const users = {
  async getByTgId(tgId: number) {
    return DEV_OPS_TEST_API.get<UserDto>(`users/tg/${tgId}`).then((response) => response?.data)
  },

  async create(dto: CreateUserDto) {
    return DEV_OPS_TEST_API.post<UserDto>('users', dto).then((response) => response?.data)
  },

  /* Статистика пользователя */
  async updateStats(dto: UpdateUserStatsDto) {
    return DEV_OPS_TEST_API.patch<UserStatsDto>('users/stats', dto).then((response) => response?.data)
  },
}
