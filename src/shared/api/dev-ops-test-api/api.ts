import axios from 'axios'

import { DEV_URL } from './constants'

export const DEV_OPS_TEST_API = axios.create({
  baseURL: DEV_URL,
})
