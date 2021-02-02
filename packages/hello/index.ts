import {App} from 'vue'

import YHello from './src/index.vue'

YHello.install = (app: App): void => {
  app.component(YHello.name, YHello)
}

export default YHello
