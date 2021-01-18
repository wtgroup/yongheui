## クイックスタート

このパートでは、webpackプロジェクトでElement Plusを用いた開発プロセスを説明します。

### vue-cli@4.5を使う

私達はvue-cli@4.5のために [Element Plus plugin](https://github.com/element-plus/vue-cli-plugin-element-plus) 提供しており, 簡単に Element Plusベースのプロジェクトを構築出来ます。

### スターターキットを使う

私達は一般的なツール[project template](https://github.com/element-plus/element-plus-starter) があります。 直接ダウンロードして使うことが出来ます。

これらのツールを使いたくない場合は、以下の記事を御覧ください。

### Element Plusをインポートする

Element Plusを完全にインポートすることも、必要なものだけをインポートすることもできます。完全なインポートから始めましょう。

#### 完全にインポートした場合

main.js:

```javascript
import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
```

上記のコードは完全にElement Plusをインポートします。CSSファイルは個別にインポートする必要があることを注意してください。

#### オンデマンド

[babel-plugin-component](https://github.com/QingWei-Li/babel-plugin-component) を用いて、 必要な分のコンポーネントをインポートし、プロジェクトをより小さくすることが出来ます。

はじめに、babel-plugin-componentをインストール:

```bash
npm install babel-plugin-component -D
```

つぎに .babelrc を編集します:

```json
{
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-plus",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

次に、ボタンとセレクトが必要な場合、main.jsを編集します:

```javascript
import { createApp } from 'vue'
import { ElButton, ElSelect } from 'element-plus';
import App from './App.vue';

const app = createApp(App)
app.component(ElButton.name, ElButton);
app.component(ElSelect.name, ElSelect);

/* or
 * app.use(ElButton)
 * app.use(ElSelect)
 */

app.mount('#app')
```

全ての例 (コンポーネントリストのリファレンスは [reference](https://github.com/element-plus/element-plus/tree/dev/packages) を御覧ください)

```javascript
import { createApp } from 'vue'
import App from './App.vue';
import {
  ElAlert,
  ElAside,
  ElAutocomplete,
  ElAvatar,
  ElBacktop,
  ElBadge,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElButtonGroup,
  ElCalendar,
  ElCard,
  ElCarousel,
  ElCarouselItem,
  ElCascader,
  ElCascaderPanel,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElContainer,
  ElDatePicker,
  ElDialog,
  ElDivider,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElImage,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElOption,
  ElOptionGroup,
  ElPageHeader,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElPopper,
  ElProgress,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSlider,
  ElStep,
  ElSteps,
  ElSubmenu,
  ElSwitch,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTimeline,
  ElTimelineItem,
  ElTooltip,
  ElTransfer,
  ElTree,
  ElUpload,
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from 'element-plus';

const components = [
  ElAlert,
  ElAside,
  ElAutocomplete,
  ElAvatar,
  ElBacktop,
  ElBadge,
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElButton,
  ElButtonGroup,
  ElCalendar,
  ElCard,
  ElCarousel,
  ElCarouselItem,
  ElCascader,
  ElCascaderPanel,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElCollapseTransition,
  ElColorPicker,
  ElContainer,
  ElDatePicker,
  ElDialog,
  ElDivider,
  ElDrawer,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElFooter,
  ElForm,
  ElFormItem,
  ElHeader,
  ElIcon,
  ElImage,
  ElInput,
  ElInputNumber,
  ElLink,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElMenuItemGroup,
  ElOption,
  ElOptionGroup,
  ElPageHeader,
  ElPagination,
  ElPopconfirm,
  ElPopover,
  ElPopper,
  ElProgress,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElRow,
  ElScrollbar,
  ElSelect,
  ElSlider,
  ElStep,
  ElSteps,
  ElSubmenu,
  ElSwitch,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElTabs,
  ElTag,
  ElTimePicker,
  ElTimeSelect,
  ElTimeline,
  ElTimelineItem,
  ElTooltip,
  ElTransfer,
  ElTree,
  ElUpload,
]

const plugins = [
  ElInfiniteScroll,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
]

const app = createApp(App)

components.forEach(component => {
  app.component(component.name, component)
})

plugins.forEach(plugin => {
  app.use(plugin)
})
```

### グローバルコンフィグ

Elenentをインポートする際、グローバルコンフィグオブジェクトを定義出来ます。現時点では2つのプロパティ: `size` と `zIndex` があります。 プロパティ `size` はすべてのコンポーネントのデフォルトサイズ、プロパティ `zIndex` はモーダルボックスの初期の z-index (デフォルト: 2000) を設定します。

Element Plusを完全にインポート：

```js
import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import App from './App.vue';

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000 });
```

Element Plusを部分的にインポート：

```js
import { createApp } from 'vue'
import { ElButton } from 'element-plus';
import App from './App.vue';

const app = createApp(App)
app.config.globalProperties.$ELEMENT = option
app.use(ElButton);
```

上記の設定では、size属性を持つすべてのコンポーネントのデフォルトのサイズは `small`、モーダルボックスのデフォルト値 `z-index` は3000となります。

### コーディングを始めましょう

プロジェクトに Vue と Element Plus を実装したので、いよいよコードを書く時が来ました。使用方法については、各コンポーネントのドキュメントを参照してください。

### Nuxt.jsを使う

[Nuxt.js](https://nuxtjs.org/) を使ってプロジェクトを立ち上げることも出来ます:

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe src="https://glitch.com/embed/#!/embed/nuxt-with-element?path=nuxt.config.js&previewSize=0&attributionHidden=true" alt="nuxt-with-element on glitch" style="height: 100%; width: 100%; border: 0;"></iframe>
</div>
