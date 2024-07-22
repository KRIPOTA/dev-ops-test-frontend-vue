import { acceptHMRUpdate, defineStore } from 'pinia'

import { arrayToObjectByKey } from '/@src/shared/utils'

import { TgUserDto, ViewerDto, ViewerState } from '../types/general.types'

const defaultViewer = (): ViewerDto => ({
  id: 0,
  externalId: 781083331,
  externalUserName: 'kreapota',
  firstName: 'Алексей',
  lastName: '',
  stats: [],
})

export const useViewerStore = defineStore({
  id: 'viewer',

  state: (): ViewerState => ({
    viewer: null,
  }),

  getters: {
    currentTaskById: (state) => arrayToObjectByKey(state.viewer?.stats || [], 'taskId'),
  },

  actions: {
    async init(user: TgUserDto | null) {
      if (!user) {
        this.viewer = defaultViewer()
      } else {
        //Будет идти запрос на получение пользователя из БД по id из тг
        const currentViewer: ViewerDto = {
          id: 0, //пока 0, потом будем брать из БД
          externalId: user.id,
          externalUserName: user.username || '',
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          stats: [],
        }

        this.viewer = currentViewer
      }
    },

    initTask(taskId: number) {
      const isTaskExist = this.viewer?.stats.find((task) => task.taskId == taskId)

      if (isTaskExist) {
        return
      }

      this.viewer?.stats.push({ taskId, questions: [] })
    },
  },
})

// Используем HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useViewerStore, import.meta.hot))
}
