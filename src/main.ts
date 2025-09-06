// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/app/router'
import { createPinia } from 'pinia'

// 全局样式
import '@/app/styles/reset.css'
import '@/app/styles/variables.css'

// ✅ 只保留移动端 TDesign（主力）
import TDesignMobile from 'tdesign-mobile-vue'
import 'tdesign-mobile-vue/es/style/index.css'
import { message } from '@/shared/composables/useGlobalMessage'

// 如果你还有桌面版页面，等“需要时”再在那个页面里按需引入桌面组件；
// 这里不做全局注册以避免样式/告警冲突。

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(TDesignMobile)

app.config.globalProperties.$message = message
app.provide('message', message)

import { useAuthStore } from '@/app/store/auth'
const auth = useAuthStore()
auth.init()

app.mount('#app')


