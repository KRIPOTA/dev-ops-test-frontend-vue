import { boot } from 'quasar/wrappers'
import { initMain, mainInited } from 'src/app/iframe-init/main'

export default boot(({ router }) => {
  router.beforeEach(async (to) => {
    if (!mainInited.value) {
      await initMain(to)
    }
  })
})
