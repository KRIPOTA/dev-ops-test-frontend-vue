import { acceptHMRUpdate, defineStore } from 'pinia'
import { Notify } from 'quasar'

import { questions } from '/@src/shared/api/dev-ops-test-api'

import { QuestionsState } from '../types/general.types'

export const useQuestionsStore = defineStore({
  id: 'questions',

  state: (): QuestionsState => ({
    questions: [],
    isLoading: false,
  }),

  getters: {},

  actions: {
    init() {
      this.load()
    },

    async load() {
      try {
        this.isLoading = true
        const response = (await questions.get()) || []

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
        this.questions.forEach((q) => {
          q.datePublishEveryDay = new Date()
          q.countTrueAnswer = q.countTrueAnswer + Number(!!q.isAnswerCorrect)
          q.countPublish = q.countPublish + 1
        })
        await questions.update(this.questions)
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
