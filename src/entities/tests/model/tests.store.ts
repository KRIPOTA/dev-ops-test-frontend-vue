import { acceptHMRUpdate, defineStore } from 'pinia'

import { arrayToObjectByKey } from '/@src/shared/utils'

import { useViewerStore } from '../../viewer'
import { TestDto, TestsState } from '../types/general.types'

const DEVOPS_TEST: TestDto = {
  id: 0,
  name: 'DevOps Test',
  questions: [
    {
      id: 0,
      text: 'Что показывает LA в Linux?',
      options: [
        { id: 0, text: 'Среднюю нагрузку системы', isRight: true },
        { id: 1, text: 'Нагрузку на процессор', isRight: false },
        { id: 2, text: 'Свободное место на диске', isRight: false },
        { id: 3, text: 'Скорость работы системы', isRight: false },
      ],
    },
    {
      id: 1,
      text: 'Что показывает LA в Linux?',
      options: [
        { id: 0, text: 'Среднюю нагрузку системы', isRight: true },
        { id: 1, text: 'Нагрузку на процессор', isRight: false },
        { id: 2, text: 'Свободное место на диске', isRight: true },
        { id: 3, text: 'Скорость работы системы', isRight: true },
      ],
    },
    {
      id: 2,
      text: 'Что показывает LA в Linux?',
      options: [
        { id: 0, text: 'Среднюю нагрузку системы', isRight: true },
        { id: 1, text: 'Нагрузку на процессор', isRight: false },
        { id: 2, text: 'Свободное место на диске', isRight: false },
        { id: 3, text: 'Скорость работы системы', isRight: false },
      ],
    },
    {
      id: 3,
      text: 'Что показывает LA в Linux?',
      options: [
        { id: 0, text: 'Среднюю нагрузку системы', isRight: true },
        { id: 1, text: 'Нагрузку на процессор', isRight: false },
        { id: 2, text: 'Свободное место на диске', isRight: false },
        { id: 3, text: 'Скорость работы системы', isRight: false },
      ],
    },
    {
      id: 4,
      text: 'Что показывает LA в Linux?',
      options: [
        { id: 0, text: 'Среднюю нагрузку системы', isRight: true },
        { id: 1, text: 'Нагрузку на процессор', isRight: false },
        { id: 2, text: 'Свободное место на диске', isRight: false },
        { id: 3, text: 'Скорость работы системы', isRight: false },
      ],
    },
  ],
}

export const useTestsStore = defineStore({
  id: 'tests',

  state: (): TestsState => ({
    list: { tasks: [] },
    current: { item: null },
  }),

  getters: {
    currentTask: (state) => state?.current?.item,

    questionsById: (state) => arrayToObjectByKey(state?.current?.item?.questions || [], 'id'),
  },

  actions: {
    init() {
      this.list.tasks.push(DEVOPS_TEST)
    },

    initCurrent(id: number) {
      const findTask = this.list.tasks.find((el) => el.id == id)

      if (!findTask) {
        this.current.item = DEVOPS_TEST
        return
      }

      this.current.item = findTask

      useViewerStore().initTask(id)
    },
  },
})

// Используем HMR
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTestsStore, import.meta.hot))
}
