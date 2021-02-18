## DictSelect 字段选择器

提供一个字段下拉框选择器的_参考范式_.
难免会遇到很多前后端都需要使用的枚举类型, 在前端是以下拉框的形式存在.
为简化配置和统一配置. 可统一由后端返回选择集.
选择集来源可以是枚举类(如`java` 的 `enum`), 或数据库字典表配置.

基于 `ant-design-vue` 的 `select`.

本组件提供三种参考方式获取选择集.
1. 枚举类全类名(`enumClass`), 如 `com.example.StatusEnum`.
2. 字典表(`dictTable`), 某一类字段项比较多时, 可单独一张表放置.
3. 字典编号(`dictCode`), 一个编号下关联了该编号下所有枚举项. 适合枚举项较少且可能变化的字典类型.

### 简单使用

前端指定选项集.

:::demo
```html
<template>
  <y-dict-select placeholder="请选择" v-model:value="myValue" :options="options" @change="changeEvent" style="width: 300px"></y-dict-select>
</template>
<script>
  export default {
    data() {
        return {
          options: [
            {value: '1', text: '一'},
            {value: '2', text: '二'},
            {value: '3', text: '三'},
          ]
        }
    },
  }
</script>
```
:::

### 后端加载选项集

可在组件创建时掉用后端api异步加载选项集.

:::demo
```html
<template>
  <y-dict-select placeholder="请选择" :load-options="loadOptions" style="width: 300px"></y-dict-select>
</template>
<script>
  export default {
    methods: {
      // 异步加载和返回选项集
      loadOptions() {
        return [
          {value: '1', text: '一'},
          {value: '2', text: '二'},
          {value: '3', text: '三'},
        ];
      }
    }
  }
</script>
```
:::



### API

#### Attributes

`ant-design-vue` `select` 的属性均可用。

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| loadOptions | 加载选项集的方法 | function | — | — |
| options | 选项集合, `{value, text, extra}`, 优先级高于`loadOptions` | array | — | — |
| excludes | 需要排除的 value , 远程加载options时有效 | string(逗号','分割) / array | — | — |