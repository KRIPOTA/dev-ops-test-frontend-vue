/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    VITE_APP_DEVELOPER_API_TOKEN: string
    VITE_APP_DEVELOPER_AMO_ACCOUNT_ID: string
    VITE_APP_DEVELOPER_AMO_USER_ID: string
  }
}
