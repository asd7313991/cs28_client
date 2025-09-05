import http from '@/app/api/http'

export interface LoginDto { username: string; password: string }
export interface RegisterDto { username: string; password: string; nickname?: string }

export const apiAuth = {
  login: (data: LoginDto) => http.post('/user/login', data),          // JSON
  register: (data: RegisterDto) => http.post('/user/register', data), // JSON
  profile: () => http.get('/user/profile'),
  refresh: (rt: string) => http.post('/user/refresh', { refresh_token: rt }),
  logout: () => http.post('/user/logout'),
  captchaImage: (key: string) => `/api/captcha/image?key=${encodeURIComponent(key)}&t=${Date.now()}`,
}
