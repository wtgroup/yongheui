/**
 * start a blank page to debug
 */
import { createApp } from 'vue'
import yongheui from 'yongheui'
import App from './play/index.vue'
import '../packages/theme-default/src/index.scss'

const app = createApp(App)
app.use(yongheui)
app.mount('#app')

