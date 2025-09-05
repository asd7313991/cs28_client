import axios from 'axios'
const baseURL = (import.meta.env.VITE_API_BASE as string) || '/api'
const instance = axios.create({ baseURL, timeout: 10000 })
instance.interceptors.response.use(r => r.data, e => Promise.reject(e))
export default instance
