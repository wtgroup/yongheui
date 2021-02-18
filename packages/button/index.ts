import {App} from 'vue'

import YLightButton from './src/light-button'

const comps = [
  YLightButton,
]

comps.forEach((comp)=>{
  comp.install = (app: App): void => {
    app.component(comp.name, comp)
  }
})

export {
  YLightButton,
}
