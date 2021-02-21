# 自定义 vue 组件库



[从零构建一个Vue UI组件库](https://segmentfault.com/a/1190000021937620)

参考源码: `E:\Work\Node\Source\ninecat-ui` (https://github.com/ninecat-ui/ninecat-ui)



依赖分类 [你需要知道的几类npm依赖包管理](https://zhuanlan.zhihu.com/p/29855253)

- dependencies
- devDependencies
- peerDependencies : 指定当前包的宿主版本. 如写 gulp 的插件, 那么, 就要注意宿主版本(gulp)兼容性问题.
- optionalDependencies
- bundledDependencies / bundleDependencies





一个基本的VUE项目大概需要这些依赖：

vue、webpack、webpack-cli、webpack-dev-server、@babel/core、babel-loader、css-loader、html-webpack-plugin、vue-loader

、vue-template-compiler



先不区分依赖类型

```node
yarn add vue webpack webpack-cli webpack-dev-server @babel/core babel-loader css-loader html-webpack-plugin vue-loader
 vue-template-compiler
```


单文件 debug
```
yarn bootstrap // 各个子package连接到 node_modules, 否则模块找不到. 新加的package必需此步
yarn website-dev:play
//source file: ./website/play/index.vue
```

```
// 生成一个组件包
yarn gen {component name}
```


==Error== Cannot read property '$createElement' of undefined
> The plugin currently doesn't allow setup returning a render function, as stated in README.
> https://github.com/vuejs/composition-api/issues/168
> (所说 plugin 应该是 `babel-plugin-transform-vue-jsx` , 它将vue文件里jsx转成js).

A: 暂还是用 render 返回jsx. setup 用来返回需要用的数据等.
```
yarn add babel-plugin-transform-vue-jsx -D -W
babel 中vue相关plugins增加 'transform-vue-jsx',
```

*.tsx 中支持setup直接返回jsx.

另一种方案. 但需要额外的 `@vue/composition-api` , _没试过_.
> In fact it works in this way:

  Make h globally available: import createElement as h from '@vue/composition-api'

  Make sure both setup and the returned function are arrow functions: setup: () => { return () => <div /> }


vue3
```
import Vue from 'vue' // 无效
console.log('------------', Vue) // ==> undefined
```

setup 应该先于 methods 和 data .
setup 中引用 methods 中方法时不行的. 但方法内部通过 `getCurrentInstance.proxy` 引用data的属性应该是可以的, 这是因为真正执行函数时,
data属性已经在instance proxy实例中可读了.

template 中调用传入的data或prop都是拆解出的value.


**按需引入**

Options can't be an array in babel@7+, but you can add plugins with name to support multiple dependencies.

For Example:

```
// .babelrc
"plugins": [
  ["import", { "libraryName": "antd", "libraryDirectory": "lib"}, "antd"],
  ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib"}, "antd-mobile"]
]
```

**rollup 打包时不识别 jsx 语法**
jsx 配置
如果 vue 中有用到 jsx 语法，则还需增加插件，否则会无法识别 jsx 语法
yarn add @vue/babel-preset-jsx
复制代码
开始在 .babelrc 折腾了好久，发现均无效，最后发现需要在 rollup.config.js 中配置 babel 预设。
```
babel({
  presets: ["@vue/babel-preset-jsx"]
})
// Note: 无效
```
https://juejin.cn/post/6872616202993139720

但就上面配置似乎无效.

有效做法:

1. `babel.config.js` plugins '@vue/babel-plugin-jsx'. (可能不需要)
2. `rollup.config.js` 引入 `const babel = require('rollup-plugin-babel')`.
```
// 放到 vue plugin 后, 否则出现不识别 template 的注释(其实可能是将template当做jsx解析了, 而注释在jsx中不识别).
babel({
    // presets: ["@vue/babel-preset-jsx"],
    extensions: [".ts", ".js", ".tsx"],
    runtimeHelpers: true,
    // exclude: /node_modules/,
    exclude: 'node_modules/**',
}),
```


**Error:** 'default' is not exported by node_modules\@babel\runtime\helpers\extends.js

https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module
https://blog.csdn.net/DreamFJ/article/details/93876688

This error frequently occurs with CommonJS modules converted by @rollup/plugin-commonjs,
which makes a reasonable attempt to generate named exports from the CommonJS code but won't always succeed,
because the freewheeling nature of CommonJS is at odds with the rigorous approach we benefit from in JavaScript modules.
It can be solved by using the namedExports option, which allows you to manually fill in the information gaps.

`yarn add -D @rollup/plugin-commonjs@^15.1.0 -W`

plugins `commonjs()`.


**ERROR** in ./node_modules/ant-design-vue/es/button/style/index.css


**ant-design-vue** 按需引入时, 样式问题

babel 配置 style=true 让他加载原生的 less .
webpack 设置 less loader.

https://github.com/ant-design/ant-design/issues/5132#issuecomment-286747637

https://github.com/ant-design/babel-plugin-import

rules 增加
```js
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

[package.json 非官方字段集合](https://segmentfault.com/a/1190000016365409)

```json
"files": [
    "lib",
    "es",
    "packages"
],
```


**monorepo**
单一仓库.
每个小组件其实是一个微小的项目. 传统思路时一个项目一个仓库.
而组件库开始时, 流行相互关系密切的各个组件放到一个仓库.
一个仓库只是表象, 关键是背后的开发模式, 以及一系列辅助开发的工具链.


```
yarn build:lib => index.js
yarn build:lib-full => index.full.js
yarn build:esm => 各个 package 的 index.js
```

**库内组件依赖时怎么配合按需引入**

我的A组件引入B组件时, A组件在外面是按需引入的. 但B组件的样式没有被引入. 怎么处理?

```
import YLightButton from '@yongheui/light-button';
&
@import "./light-button";
```

**`index.esm.js` 中的 `@yongheui/xxx` 模块没有替换为路径**

@yongheui/light-button in E:/Work/Node/DemoSet/yongheui/lib/index.esm.js

`rollup --config ./build/rollup.config.bundle.js`


[!] (plugin rpt2) Error: E:/Work/Node/DemoSet/yongheui/packages/search-select/index.ts(8,5): semantic error TS4023: Exported variable '_SearchSelect' has or is using name 'CHANGE_EVENT' from external module "E:/Work/Node/DemoSet/yongheui/packages/search-select/src/index" but cannot be named.
packages\search-select\index.ts
Error: E:/Work/Node/DemoSet/yongheui/packages/search-select/index.ts(8,5): semantic error TS4023: Exported variable '_SearchSelect' has or is using name 'CHANGE_EVENT' from external module "E:/Work/Node/DemoSet/yongheui/packages/search-select/src/index" but cannot be named.

```
[xxx]: yyy --> [xxx as string|number]: yyy
```

**vue 和 ts(x) 混用时, monorepo 库内依赖导入问题**

库内包依赖, 用的 node resolve 整合成一个 bundle .

!!巨坑!! ts 依赖 vue 省略后缀正常; vue 依赖 ts 省略后缀会有问题.

解决:
```
// 前提是 @yongheui/light-button 的 package.json main 指向正确(index.ts)
import YLightButton from '@yongheui/light-button'
// vue 文件中导入 ts 带上后缀
import {isEmpty} from '@yongheui/utils/util.ts'
```


`less` 相关依赖放入 `dependencies` , 这是内部处理 antd 按需引入用的. 让其对我的用户透明. (貌似不行)
```
"less": "^4.1.1",
"less-loader": "^7.0.0",
```


```
// vue.config.js
module.exports = {
  // https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9-loader-%E9%80%89%E9%A1%B9
  chainWebpack: config => {
    config.module
      // .rule('css')
      //   .test(/\.css$/)
      //   .use('style-loader').loader('style-loader').end()
      //   .use('css-loader').loader('css-loader').end()
      .rule('antd-less')
        .test(/\.less$/)
        .use('less-loader').loader('less-loader')
        .tap(options => {
          // 修改它的选项...
          options || (options = {})
          options.lessOptions = {javascriptEnabled: true};
          return options
        }).end()
        // .use('css-loader').loader('css-loader')
        // .tap(options => {
        //   // 修改它的选项...
        //   options || (options = {})
        //   options.sourceMap = true;
        //   return options
        // }).end()
        // .use('style-loader').loader('style-loader').end()


  }
}
```


```
// 全量引入
import {Button} from 'ant-design-vue';
// 这样才能按需引入
import Button from 'ant-design-vue/lib/button';
```

遗留问题:
yongheui babel 按需引入有问题. (OK, 外部新建vue项目, 安装npm上的yongheui, 按需引入正常)
antd less 文件需要对应 less 配置. (OK, 但, 需要配置, 上文. ? 怎么让我的用户无需配置 ?)


**lerna**
https://juejin.cn/post/6844903911095025678
