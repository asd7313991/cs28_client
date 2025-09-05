import axios, { AxiosError } from 'axios'

const baseURL = (import.meta.env.VITE_API_BASE as string) || '/api'

const request = axios.create({
  baseURL,
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  // 需要的话可在此注入 token
  return config
})

request.interceptors.response.use(
  (res) => res.data,
  (error: AxiosError) => {
    const msg =
      (error.response?.data as any)?.message ||
      error.message ||
      'Network Error'
    console.error('[API ERROR]:', msg)
    return Promise.reject(error)
  },
)

export default request
