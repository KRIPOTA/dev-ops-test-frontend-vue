import axios from 'axios'

import { DEV_URL, MAIN_URL } from './constants'

const isDev = location.hostname === 'localhost'

export const DEV_OPS_TEST_API = axios.create({
  baseURL: isDev ? DEV_URL : MAIN_URL,
})
