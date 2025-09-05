import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import TDesign from 'tdesign-mobile-vue'
import 'tdesign-mobile-vue/es/style/index.css'
import './styles/theme.css'
import './styles/base.css'
import './styles/global.css'

createApp(App).use(createPinia()).use(router).use(TDesign).mount('#app')
