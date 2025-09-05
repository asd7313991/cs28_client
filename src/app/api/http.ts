import axios, { AxiosError } from 'axios'
import { Toast } from 'tdesign-mobile-vue'
import { useAuthStore } from '@/app/store/auth'

const http = axios.create({ baseURL: '/api', timeout: 15000 })

http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.accessToken) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const auth = useAuthStore()

    if (status === 401) {
      auth.clear()
      Toast.warning({ content: '登录过期，请重新登录', duration: 1500 })
    } else {
      const msg = (error.response?.data as any)?.detail
        || (error.response?.data as any)?.message
        || error.message
      if (msg) Toast.warning({ content: String(msg), duration: 1500 })
    }
    return Promise.reject(error)
  },
)

export default http
