// import type { App } from 'vue'
import { App } from 'vue'
import YHello from '@yongheui/hello'

// if you encountered problems alike "Can't resolve './version'"
// please run `yarn bootstrap` first
import { version as version_ } from './version'
// import { setConfig } from '@element-plus/utils/config'

const version = version_ // version_ to fix tsc issue

// const locale = use

// const defaultInstallOpt: InstallOptions = {
//   size: '' as ComponentSize,
//   zIndex: 2000,
// }

const components = [
  YHello,
]

// const plugins = [
//   ElInfiniteScroll,
//   ElLoading,
//   ElMessage,
//   ElMessageBox,
//   ElNotification,
// ]

const install = (app: App, opt): void => {
  // const option = Object.assign(defaultInstallOpt, opt)
  // locale(option.locale)
  // app.config.globalProperties.$ELEMENT = option
  // setConfig(option)

  components.forEach(component => {
    app.component(component.name, component)
  })

  // plugins.forEach(plugin => {
  //   app.use(plugin as any)
  // })
}

// import {SqHello} from 'ui库', 按需引入
export {
  YHello,
  // version,
  // install,
  // locale,
}

// import Antd from 'ant-design-vue', 全量引入
export default {
  version,
  install,
}
