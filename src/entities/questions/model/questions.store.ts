import { acceptHMRUpdate, defineStore } from 'pinia'
import { Notify } from 'quasar'

import { QuestionParams, questions } from '/@src/shared/api/dev-ops-test-api'

import { useThemesStore } from '../../themes'
import { QuestionsState } from '../types/general.types'

export const useQuestionsStore = defineStore({
  id: 'questions',

  state: (): QuestionsState => ({
    questions: [],
    isLoading: false,
    isAdditionalQuestionsLoaded: false,
  }),

  getters: {},

  actions: {
    async init() {
      const themesStore = useThemesStore()
      if (themesStore.isCurrentThemeRandom) await this.loadByDate()
      else await this.loadByCurrentTags()
    },

    async getQuestions(params: QuestionParams) {
      try {
        const response = await questions.get(params)
        return response
      } catch (e) {
        Notify.create({ type: 'negative', message: 'Произошла ошибка при загрузке вопросов' })
        console.debug('Произошла ошибка при получении вопросов', { e })
      }
    },

    async loadAdditionalQuestions(limit = 20) {
      const questions = (await this.getQuestions({ limit, tags: useThemesStore().currentTags })) || []
      const additionalQuestions = questions.map((q) => ({ ...q, isAnswerCorrect: null }))
      this.questions = [...this.questions, ...additionalQuestions]
      this.isAdditionalQuestionsLoaded = true
    },

    async loadByCurrentTags() {
      this.isLoading = true
      const themesStore = useThemesStore()
      const questions = (await this.getQuestions({ limit: 10, tags: themesStore.currentTags })) || []
      this.questions = questions.map((q) => ({ ...q, isAnswerCorrect: null }))
      this.isLoading = false
    },

    async loadByDate() {
      try {
        this.isLoading = true
        const response = (await questions.getByDate()) || []

        this.questions = response.map((q) => ({ ...q, isAnswerCorrect: null }))
      } catch (e) {
        Notify.create({ type: 'negative', message: 'Произошла ошибка при загрузке вопросов' })
        console.debug('Произошла ошибка при получении вопросов', { e })
      } finally {
        this.isLoading = false
      }
    },

    async updateQuestions() {
      try {
        if (!this.isAdditionalQuestionsLoaded) {
          this.questions.forEach((q) => {
            q.datePublishEveryDay = new Date()
            q.countTrueAnswer = q.countTrueAnswer + Number(!!q.isAnswerCorrect)
            q.countPublish = q.countPublish + 1
          })
          await questions.update(this.questions)
        }
      } catch (e) {
        Notify.create({ type: 'negative', message: 'Произошла ошибка при сохранении вопросов' })
        console.debug('Произошла ошибка при сохранении вопросов', { e })
      }
    },
  },
})

// Используем HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuestionsStore, import.meta.hot))
}
