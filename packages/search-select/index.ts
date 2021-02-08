import {App} from 'vue'

import YSearchSelect from './src/index.tsx'

YSearchSelect.install = (app: App): void => {
  app.component(YSearchSelect.name, YSearchSelect)
}

export default YSearchSelect
