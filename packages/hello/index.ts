import {App} from 'vue'
import type {SFCWithInstall} from "@yongheui/utils/types";

import Hello from './src/index.vue'

Hello.install = (app: App): void => {
  app.component(Hello.name, Hello)
}

// @ts-ignore
const _Hello: SFCWithInstall<typeof Hello> = Hello

export default _Hello
