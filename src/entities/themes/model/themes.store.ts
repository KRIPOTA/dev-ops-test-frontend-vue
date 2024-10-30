import { keyBy } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { ThemeDto, themes } from '/@src/shared/api/dev-ops-test-api'

import { ThemesState } from '../types/general.types'

const randomTheme: ThemeDto = { id: 'random', theme: 'Случайные темы', tags: [] }

export const useThemesStore = defineStore({
  id: 'themes',

  state: (): ThemesState => ({
    themes: [],
    current: randomTheme,
    isLoading: false,
  }),

  getters: {
    themesById: (state): Record<string, ThemeDto | undefined> => keyBy(state.themes, 'id'),
    themesAsDropdown: (state): ThemeDto[] => [randomTheme, ...state.themes],
    currentTags: (state): string[] => state.current?.tags || [],
    isCurrentThemeRandom: (state): boolean => state.current?.id == 'random',
  },

  actions: {
    async init() {
      await this.load()
    },

    async load() {
      try {
        this.isLoading = true
        this.themes = await themes.get()
        console.log(this.themes)
      } catch (e) {
        console.debug('Ошибка загрузки тем', { e })
      } finally {
        this.isLoading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useThemesStore, import.meta.hot))
}
