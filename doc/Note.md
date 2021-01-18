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
