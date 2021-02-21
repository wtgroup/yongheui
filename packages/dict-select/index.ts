import {App} from 'vue'
import type {SFCWithInstall} from "@yongheui/utils/types";
import DictSelect from './src/index'

// @ts-ignore
DictSelect.install = (app: App): void => {
  app.component(DictSelect.name, DictSelect)
}

// @ts-ignore
const _DictSelect: SFCWithInstall<typeof DictSelect> = DictSelect;

export default _DictSelect
