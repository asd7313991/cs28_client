// src/app/store/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { apiAuth } from '@/app/api/auth'

export interface UserProfile {
  id: number
  username: string
  nickname?: string
  avatar_url?: string
  status: number
  balance: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: (localStorage.getItem('at') || '') as string,
    profile: null as UserProfile | null,
    loadingProfile: false,
  }),
  getters: {
    // 有 token 即认为已登录（避免刷新瞬间因 profile 未拉到被判未登录）
    isLogin: (s) => !!s.accessToken,
    hasProfile: (s) => !!s.profile,
  },
  actions: {
    /** 在应用启动或路由守卫中调用：恢复 token，设置头，必要时拉取资料 */
    async init() {
      const at = localStorage.getItem('at') || ''
      if (at) {
        this.accessToken = at
        axios.defaults.headers.common.Authorization = `Bearer ${at}`
        if (!this.profile && !this.loadingProfile) {
          try {
            await this.fetchProfile()
          } catch {
            this.clear()
          }
        }
      } else {
        this.clearHeaders()
      }
    },

    setToken(at: string) {
      this.accessToken = at
      localStorage.setItem('at', at)
      axios.defaults.headers.common.Authorization = `Bearer ${at}`
    },

    clearHeaders() {
      delete axios.defaults.headers.common.Authorization
    },

    clear() {
      this.accessToken = ''
      this.profile = null
      localStorage.removeItem('at')
      this.clearHeaders()
    },

    async fetchProfile() {
      this.loadingProfile = true
      try {
        const { data } = await apiAuth.profile()
        // 兼容 { data: {...} } 或直接 {...}
        this.profile = (data?.data ?? data) as UserProfile
        return this.profile
      } finally {
        this.loadingProfile = false
      }
    },

    async login(username: string, password: string) {
      const { data } = await apiAuth.login({ username, password })
      const at = data?.data?.access_token || data?.access_token
      if (!at) throw new Error('登录返回缺少 access_token')
      this.setToken(at)
      await this.fetchProfile()
      return true
    },

    async register(username: string, password: string, nickname?: string) {
      await apiAuth.register({ username, password, nickname })
      return true
    },

    async logout() {
      // 如果后端提供 /user/logout，可在此先调用
      this.clear()
    },
  },
})
