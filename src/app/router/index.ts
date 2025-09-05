import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/app/layout/AppLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/features/home/pages/Home.vue') },
      { path: 'room/:code?', name: 'room', component: () => import('@/features/room/pages/Room.vue') },
      { path: 'user', name: 'user', component: () => import('@/features/user/pages/User.vue') },
      { path: 'login', name: 'login', component: () => import('@/features/user/pages/Login.vue') },
      { path: 'register', name: 'register', component: () => import('@/features/user/pages/Register.vue') },
    ],
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})
