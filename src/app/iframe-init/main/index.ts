import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

import { TgUserDto, useViewerStore } from '/@src/entities/viewer'

export const mainInited = ref<boolean>(false)

export const initMain = async (to: RouteLocationNormalized) => {
  try {
    const tgWebApp = window['Telegram'].WebApp || null

    if (!tgWebApp) return

    const tgUser = tgWebApp?.initDataUnsafe?.use || (null as TgUserDto | null)

    await useViewerStore().init(tgUser)
  } finally {
    mainInited.value = true
  }
}
