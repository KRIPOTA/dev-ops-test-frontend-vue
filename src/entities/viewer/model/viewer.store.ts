import { isAxiosError } from 'axios'
import dayjs from 'dayjs'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { Notify, QTableProps } from 'quasar'

import { CreateUserDto, users } from '/@src/shared/api/dev-ops-test-api'

import { TgUserDto, ViewerState } from '../types/general.types'

export const useViewerStore = defineStore({
  id: 'viewer',

  state: (): ViewerState => ({
    viewer: null,
    isInited: false,
    initialStats: {
      questionsAnswer: 0,
      questionsAnswerTrue: 0,
    },
  }),

  getters: {
    columns(): QTableProps['columns'] {
      return [
        { name: 'period', align: 'center', label: 'Период', field: 'period' },
        { name: 'correctAnswers', align: 'center', label: 'Правильных ответов', field: 'correctAnswers' },
        { name: 'countAnswers', align: 'center', label: 'Решено вопросов', field: 'countAnswers' },
      ]
    },

    rows(state): QTableProps['rows'] {
      return [
        {
          period: 'Сегодня',
          correctAnswers: `${state.initialStats.questionsAnswerTrue} (${this.percentCorrectAnswer.today}%)`,
          countAnswers: state.initialStats.questionsAnswer,
        },
        {
          period: 'Всего',
          correctAnswers: `${state.viewer?.stats.questionsAnswerTrue} (${this.percentCorrectAnswer.all}%)`,
          countAnswers: state.viewer?.stats.questionsAnswer,
        },
      ]
    },

    isAlreadyVisitToday(state): boolean {
      const loginLastDate = state.viewer?.stats.loginLast

      if (loginLastDate) {
        const hoursDiff = dayjs().diff(dayjs(loginLastDate), 'hours')
        return hoursDiff < 24
      }

      return false
    },

    percentCorrectAnswer(state): { today: number; all: number } {
      const percentCorrectAnswerToday =
        ((state.initialStats.questionsAnswerTrue || 0) / (state.initialStats?.questionsAnswer || 1)) * 100

      const percentCorrectAnswerAll =
        ((state.viewer?.stats.questionsAnswerTrue || 0) / (state.viewer?.stats?.questionsAnswer || 1)) * 100

      return {
        today: Math.ceil(percentCorrectAnswerToday || 0),
        all: Math.ceil(percentCorrectAnswerAll || 0),
      }
    },

    loginFirst: (state): boolean => state.initialStats.loginLast == null,
  },

  actions: {
    async init(tgUser: TgUserDto | null) {
      //FIXME: костыль
      if (!tgUser) {
        tgUser = { id: 781083331, first_name: 'Алексей', username: 'kreapota' }
      }
      try {
        this.isInited = false
        if (tgUser) {
          //Будет идти запрос на получение пользователя из БД по id из тг
          const currentViewer = await users.getByTgId(tgUser.id)
          this.viewer = currentViewer
        }
      } catch (e) {
        if (isAxiosError(e) && Number(e.response?.status) == 404) {
          const user: CreateUserDto = {
            tgId: tgUser.id,
            isBot: !!tgUser.is_bot,
            username: tgUser.username || '',
            firstName: tgUser.first_name || '',
            lastName: tgUser.last_name || '',
            photoUrl: tgUser.photo_url || '',
          }

          this.viewer = await users.create(user)
        } else {
          Notify.create({ type: 'negative', message: 'Произошла ошибка при инициализации пользователя' })
          console.debug('Произошла ошибка при инициализации пользователя', { e })
        }
      } finally {
        this.isInited = true
      }
    },

    async updateUserStats() {
      try {
        if (this.viewer?.stats) {
          this.viewer.stats.loginLast = new Date()
          this.viewer.stats.loginCountDays = this.viewer.stats.loginCountDays + 1
          users.updateStats(this.viewer.stats)
        }
      } catch (e) {
        Notify.create({ type: 'negative', message: 'Произошла ошибка при обновлении статистики пользователя' })
        console.debug('Произошла ошибка при обновлении статистики пользователя', { e })
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useViewerStore, import.meta.hot))
}
