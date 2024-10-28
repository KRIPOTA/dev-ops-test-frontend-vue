import { ThemeDto } from '/@src/shared/api/dev-ops-test-api/themes'

export interface ThemesState {
  themes: ThemeDto[]
  current: ThemeDto | null
  isLoading: boolean
}
