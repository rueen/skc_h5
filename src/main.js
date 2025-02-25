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
import i18n from './i18n'
import App from './App.vue'

// 导入Vant样式
import 'vant/lib/index.css'
// 导入需要的组件
import { 
  Tabbar, 
  TabbarItem,
  Tab,
  Tabs,
  Form,
  Field,
  CellGroup,
  Button,
  Area,
  Checkbox,
  CheckboxGroup,
  PullRefresh,
  List,
  Tag,
  Image,
  Icon
} from 'vant'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
// 注册Vant组件
app.use(Tabbar)
app.use(TabbarItem)
app.use(Tab)
app.use(Tabs)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(Button)
app.use(Area)
app.use(Checkbox)
app.use(CheckboxGroup)
app.use(PullRefresh)
app.use(List)
app.use(Tag)
app.use(Image)
app.use(Icon)

app.mount('#app')
