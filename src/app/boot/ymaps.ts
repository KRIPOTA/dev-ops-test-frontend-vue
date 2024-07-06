import { boot } from 'quasar/wrappers'
import { createYmaps } from 'vue-yandex-maps'

export default boot(({ app }) => {
  app.use(
    createYmaps({
      apikey: '93b52ef6-fddc-4fa3-a9e9-badaae47a2bb',
    })
  )
})
