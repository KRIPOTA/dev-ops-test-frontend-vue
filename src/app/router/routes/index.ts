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
        path: '',
        name: 'MAIN',
        component: () => import('src/pages/Main.vue'),
      },
      {
        path: '/test',
        name: 'TEST',
        component: () => import('src/pages/Test.vue'),
      },
    ],
  },
  notFound,
]

export default routes
