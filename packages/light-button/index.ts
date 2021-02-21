import { App } from 'vue'
import LightButton from './src/index'

// @ts-ignore
LightButton.install = (app: App): void => {
  // @ts-ignore
  app.component(LightButton.name, LightButton)
}

export default LightButton
