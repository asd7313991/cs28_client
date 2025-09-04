import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE, timeout: 15000 })
http.interceptors.request.use((config) => { const auth = useAuthStore(); if (auth.token) { config.headers = config.headers || {}; config.headers['Authorization'] = `Bearer ${auth.token}` } return config })
http.interceptors.response.use((resp) => {
  const data = resp.data
  if (typeof data === 'object' && data && 'code' in data) {
    if (data.code === 0) return data.data
    const err:any = new Error(data.msg || '请求失败'); err.code = data.code; throw err
  }
  return data
}, (error) => Promise.reject(error))
export default http
