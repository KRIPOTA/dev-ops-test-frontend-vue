import { ref } from 'vue'

export const mainInited = ref<boolean>(false)

export const initMain = async () => {
  mainInited.value = true
}
