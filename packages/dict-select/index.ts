import {App} from 'vue'

import YDictSelect from './src/index.tsx'

YDictSelect.install = (app: App): void => {
  app.component(YDictSelect.name, YDictSelect)
}

export default YDictSelect
