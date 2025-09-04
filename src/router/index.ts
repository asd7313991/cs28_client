import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home.vue'), meta: { tab: true, auth: false } },
  { path: '/hall', name: 'Hall', component: () => import('@/pages/Hall.vue'), meta: { tab: true, auth: false } },
  { path: '/room/:id', name: 'Room', component: () => import('@/pages/Room.vue'), meta: { auth: false } },
  { path: '/orders', name: 'Orders', component: () => import('@/pages/Orders.vue'), meta: { tab: true, auth: true } },
  { path: '/activity', name: 'Activity', component: () => import('@/pages/Activity.vue'), meta: { tab: true, auth: false } },
  { path: '/user', name: 'User', component: () => import('@/pages/User.vue'), meta: { tab: true, auth: true } },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue'), meta: { auth: false } },
]
const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(){ return { top: 0 } } })
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuthed) { auth.setRedirect(to.fullPath); return next({ name: 'Login' }) }
  next()
})
export default router
