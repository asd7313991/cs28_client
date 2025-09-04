import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<any | null>(null)
  const redirectAfterLogin = ref<string | null>(null)
  const isAuthed = computed(() => !!token.value)
  function setToken(t: string | null) { token.value = t; if (t) localStorage.setItem('token', t); else localStorage.removeItem('token') }
  function setUser(u: any | null) { user.value = u }
  function setRedirect(p: string | null) { redirectAfterLogin.value = p }
  return { token, user, isAuthed, redirectAfterLogin, setToken, setUser, setRedirect }
})
