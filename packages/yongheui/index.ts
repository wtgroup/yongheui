// import type { App } from 'vue'
import { App } from 'vue'
import YHello from '@yongheui/hello'
import YSearchSelect from '@yongheui/search-select'
// import {YLightButton} from '@yongheui/button'
import YLightButton from '@yongheui/light-button'
import YDictSelect from '@yongheui/dict-select'
import YNestCriterion from '@yongheui/nest-criterion'

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
  YSearchSelect,
  YLightButton,
  YDictSelect,
  YNestCriterion,
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

  // app.component 并不会调用 install , 故这里改成这样. 这就要求所有 install 方法需要自己 app.component(Xxx.name, Xxx);
  components.forEach(component => {
    // @ts-ignore
    if (component.install) {
      // @ts-ignore
      component.install(app);
    } else {
      // @ts-ignore
      app.component(component.name, component);
    }
  })

  // plugins.forEach(plugin => {
  //   app.use(plugin as any)
  // })
}

// import {YHello} from 'ui库', 按需引入
export {
  YHello,
  YSearchSelect,
  YLightButton,
  YDictSelect,
  YNestCriterion,
  // version,
  // install,
  // locale,
}

// import Antd from 'ant-design-vue', 全量引入
export default {
  version,
  install,
}
