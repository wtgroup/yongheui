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


