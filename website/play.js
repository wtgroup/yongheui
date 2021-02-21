/**
 * start a blank page to debug
 */
import { createApp } from 'vue'
// 全量引入
import yongheui from 'yongheui'
import '../packages/theme-default/src/index.scss'
import App from './play/index.vue'

const app = createApp(App)

// 按需引入
// import { YNestCriterion } from 'yongheui';
// app.use(YNestCriterion); // 按需全局注册

app.use(yongheui) // 全量全局注册
app.mount('#app')

