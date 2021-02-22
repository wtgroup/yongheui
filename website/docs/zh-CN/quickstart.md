## 快速开始

本节介绍如何在项目中使用 `Yongheui` .

### 引入 Yongheui
你可以引入整个 Yongheui，或是根据需要仅引入部分组件。我们先介绍如何引入完整的 Yongheui。

#### 完整引入

在`main.js`中:
```js
import { createApp } from 'vue'
import App from './App.vue'
// 全量引入 yongheui
import Yongheui from 'yongheui'
// 手动引入主题样式
import 'yongheui/lib/theme-default/index.css'

const app = createApp(App);
app.use(Yongheui)
app.mount('#app')
```

#### 按需引入

##### 手动按需引入

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'

// 仅引用 YHello
import YHello from "yongheui/lib/y-hello";
import "yongheui/lib/theme-default/y-hello.css"; // 样式必需

const app = createApp(App);
app.use(YHello) // 注册
app.mount('#app')
```

##### 借助 babel-plugin-import 按需引入

1. 安装 babel-plugin-import
```
yarn add babel-plugin-import -D // 或: npm install babel-plugin-import -D
```
2. 配置 `babel.config.js` :
```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      "import",
      { "libraryName": "yongheui", "libraryDirectory": "lib",
        customStyleName: (name) => {
          // 由于 customStyleName 在配置中被声明的原因，`style: true` 会被直接忽略掉，
          // 如果你需要使用 scss 源文件，把文件结尾的扩展名从 `.css` 替换成 `.scss` 就可以了
          return `yongheui/lib/theme-default/${name}.css`;
        },
      },
      "yongheui"
    ]
  ],
}

```

接下来，如果你只希望引入部分组件，比如 `YHello` ，那么需要在 `main.js` 中写入以下内容：
```js
import { createApp } from 'vue'
import App from './App.vue'

// babel-plugin-import 会找到对应的样式并引入
import {YHello} from "yongheui";

const app = createApp(App);
app.use(YHello)
app.mount('#app')
```


#### 特别说明

由于本组件库依赖了 `ant-design-vue` , 该库使用了 less 样式文件. 故您在使用时, 需要配置 less 的解析. (*待优化*)

下面是参考配置.

- vue 打包时

```js
// vue.config.js
module.exports = {
  // https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9
  chainWebpack: config => {
    config.module
      .rule('antd-less')
        .test(/\.less$/)
        .use('less-loader').loader('less-loader')
        .tap(options => {
          // 修改它的选项...
          options || (options = {})
          options.lessOptions = {javascriptEnabled: true};
          return options
        }).end()
  }
}
```

- webpack 打包时

```js
// module.rules 增加下面规则
{
    test: /ant.*\.less$/,
    ...(process.env.PRODUCTION ? {
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?importLoaders=1', /*'postcss-loader',*/ {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}}]
      })
    } : {
      use: ["style-loader", {loader: 'css-loader', options: {sourceMap: true}}, /*"postcss-loader",*/ {loader: 'less-loader', options: {lessOptions: {javascriptEnabled: true}}}]
    } )
}
```
