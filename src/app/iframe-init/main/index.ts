import { ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router'

export const mainInited = ref<boolean>(false)

export const initMain = async (to: RouteLocationNormalized) => {
  try {

  } finally {
    mainInited.value = true
  }
}
