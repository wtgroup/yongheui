/**
 * start a blank page to debug
 */
import { createApp } from 'vue'
import Sqbdui from 'yongheui'
import App from './play/index.vue'
import '../packages/theme-default/src/index.scss'

const app = createApp(App)
app.use(Sqbdui)
app.mount('#app')

