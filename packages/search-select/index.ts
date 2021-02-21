import {App} from 'vue'
import type {SFCWithInstall} from "@yongheui/utils/types";
import SearchSelect from './src/index'

// @ts-ignore
SearchSelect.install = (app: App): void => {
  app.component(SearchSelect.name, SearchSelect)
}

// @ts-ignore
const _SearchSelect: SFCWithInstall<typeof SearchSelect> = SearchSelect

export default _SearchSelect
