/*
 * @Author: diaochan
 * @Date: 2025-02-25 10:09:01
 * @LastEditors: diaochan
 * @LastEditTime: 2025-02-25 10:11:13
 * @Description: 
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// 导入Vant样式
import 'vant/lib/index.css'
// 导入需要的组件
import { Tabbar, TabbarItem } from 'vant'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// 注册Vant组件
app.use(Tabbar)
app.use(TabbarItem)

app.mount('#app')
