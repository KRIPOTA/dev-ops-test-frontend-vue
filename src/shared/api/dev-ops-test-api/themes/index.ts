import { DEV_OPS_TEST_API } from '../api'
import { ThemeDto } from './dto'

export * from './dto'

export const themes = {
  async get() {
    return DEV_OPS_TEST_API.get<ThemeDto[]>('themes').then((response) => response?.data)
  },
}
