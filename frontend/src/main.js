import '@/styles/common.scss' // 公共样式
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {lazyPlugin} from "@/directives/index.js";
import {componentPlugin} from "@/components/index.js";
// 引入pinia持久缓存插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'



const app = createApp(App)
// pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// router
app.use(router)

// 图片懒加载指令
app.use(lazyPlugin)
// 全局组件插件化配置
app.use(componentPlugin)

app.mount('#app')
