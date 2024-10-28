import { acceptHMRUpdate, defineStore } from 'pinia'

import { themes } from '/@src/shared/api/dev-ops-test-api'

import { ThemesState } from '../types/general.types'

export const useThemesStore = defineStore({
  id: 'viewer',

  state: (): ThemesState => ({
    themes: [],
    current: null,
    isLoading: false,
  }),

  getters: {
    currentTags: (state): string[] => state.current?.tags || [],
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
