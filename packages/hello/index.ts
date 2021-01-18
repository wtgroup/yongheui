import {App} from 'vue'

import SqHello from './src/index.vue'

SqHello.install = (app: App): void => {
  app.component(SqHello.name, SqHello)
}

export default SqHello
