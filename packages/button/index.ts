import {App} from 'vue'

import YLightButton from './src/light-button'

const buttons = [
  YLightButton,
]

buttons.forEach((comp)=>{
  comp.install = (app: App): void => {
    app.component(comp.name, comp)
  }
})

const YButton = {
  YLightButton,
  install: (app: App): void => {
    buttons.forEach(comp => app.use(comp)); // 安装每个按钮
  },
}

export default YButton;
