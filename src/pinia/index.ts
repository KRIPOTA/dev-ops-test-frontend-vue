import { createPinia } from 'pinia'
import { QVueGlobals, useQuasar } from 'quasar'
import { store } from 'quasar/wrappers'
import type { Router } from 'vue-router'

/*
 * When adding new properties to stores, you should also
 * extend the `PiniaCustomProperties` interface.
 * @see https://pinia.vuejs.org/core-concepts/plugins.html#typing-new-store-properties
 */
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router
    $q: QVueGlobals
  }
}

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)

  pinia.use(({ store }) => {
    const $q = useQuasar()
    store.$q = $q
  })

  return pinia
})