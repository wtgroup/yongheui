import {App} from 'vue'

import YNestCriterion from './src/index.vue'
import { Select, Button, Tooltip, Input } from "ant-design-vue";

YNestCriterion.install = (app: App): void => {
  app.component(YNestCriterion.name, YNestCriterion);
  // 同时把依赖的 antdv 相关组件注册
  app.component("ASelect", Select);
  app.component("ASelectOption", Select.Option);
  app.component("ATooltip", Tooltip);
  app.component("AInput", Input);
  app.component("AButton", Button);
}

export default YNestCriterion
