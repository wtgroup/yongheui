import {App, createApp} from 'vue'
import type {SFCWithInstall} from "@yongheui/utils/types";
import NestCriterion from './src/index.vue'
// import { Select, Button, Tooltip, Input } from "ant-design-vue";

// @ts-ignore
NestCriterion.install = (app: App): void => {
  // @ts-ignore
  app.component(NestCriterion.name, NestCriterion);
  // // 同时把依赖的 antdv 相关组件注册
  // app.component("ASelect", Select);
  // app.component("ASelectOption", Select.Option);
  // app.component("ATooltip", Tooltip);
  // app.component("AInput", Input);
  // app.component("AButton", Button);
}

// @ts-ignore
const _NestCriterion: SFCWithInstall<typeof NestCriterion> = NestCriterion;

export default _NestCriterion
