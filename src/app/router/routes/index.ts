import type { RouteRecordRaw } from 'vue-router'

/** Роут страницы NOT FOUND. Всегда должно быть ПОСЛЕДНЕЙ в массиве routes */
const notFound: RouteRecordRaw = {
  path: '/:catchAll(.*)*',
  component: () => import('src/pages/ErrorNotFound.vue'),
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/app/App.vue'),
    alias: ['/'],
    children: [
      {
        path: 'main',
        name: 'MAIN',
        component: () => import('src/pages/Main.vue'),
      },
    ],
  },
  notFound,
]

export default routes
