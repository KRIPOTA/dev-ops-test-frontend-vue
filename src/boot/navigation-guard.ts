import { boot } from 'quasar/wrappers'
import { initMain, mainInited } from 'src/iframe-init/main'

export default boot(({ router }) => {
  router.beforeEach(async (to) => {
    if (!mainInited.value) {
      if (to.name == 'TEST') {
        router.replace({ name: 'MAIN' })
      }
      await initMain(to)
    }
  })
})
