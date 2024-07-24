import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

import { TgUserDto, useViewerStore } from '/@src/entities/viewer'

export const mainInited = ref<boolean>(false)

export const initMain = async (to: RouteLocationNormalized) => {
  mainInited.value = true
}
