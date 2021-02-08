## SearchSelect 搜索选择器

对 `ant-design-vue` `select` 的封装。
**为解决普通下拉框选项过多导致渲染慢的问题。**
1000个item，仅渲染就约3s，每次点击下拉框就要等待3s，频繁操作时让人抓狂。
本选择器默认只展示少量的选项集，利用滚动翻页的方式加载更多选项集，极大减少单次渲染的项数，来减少等待时长。

### 基本用法

基本使用和`ASelect`基本一致，选项参数方法透传。

:::demo
```html
<template>
  <y-search-select v-model:value="myValue" placeholder="请选择" style="width: 300px" :full-options="options" />
</template>
<script>
  export default {
    data() {
      return {
          myValue: 3,
          options: [
              {value: 1, text: '张三', extra: '小张三'},
              {value: 2, text: '李四'},
              {value: 3, text: '王五', extra: '3'},
              {value: 4, text: '赵六', extra: '4'},
          ],
      }
    },
  }
</script>
```
:::


### 自定义选项渲染(slot)

:::demo
```html
<template>
  <y-search-select placeholder="请选择" style="width: 300px" :full-options="options">
      <template v-slot="{value, text, extra}">
        {{value}} -- {{text}} -- {{extra}}
      </template>
  </y-search-select>
</template>
<script>
  export default {
    data() {
      return {
          options: [
              {value: 1, text: '张三', extra: '小张三'},
              {value: 2, text: '李四'},
              {value: 3, text: '王五', extra: '3'},
              {value: 4, text: '赵六', extra: '4'},
          ],
      }
    },
  }
</script>
```
:::


### 选项分页

解决普通下拉框选项过多导致渲染慢的问题。

:::demo
```html
<template>
  <y-search-select placeholder="请选择" style="width: 300px" :full-options="bigOptions"
                   @change="changeEvent"
  />
</template>
<script>
  const TAG = "[YSearchSelect]"
  const mockFullOptions = () => {
    let arr = [];
    for (let i = 0; i < 2000; i++) {
      arr.push({
        value: i,
        text: 'text' + i,
      })
    }
    return arr;
  }

  export default {
    data() {
      return {
          bigOptions: mockFullOptions(),
      }
    },
    methods: {
      changeEvent(args) {
        console.log(TAG, 'changeEvent:', args);
      }
    }
  }
</script>
```
:::


### 自定义搜索

:::demo
```html
<template>
  <y-search-select placeholder="请选择" style="width: 300px" :full-options="options"
                   :search="mySearch"
  />
</template>
<script>
  const TAG = "[YSearchSelect]"
  export default {
    data() {
      return {
          options: [
              {value: 1, text: '张三', extra: '小张三'},
              {value: 2, text: '李四'},
              {value: 3, text: '王五', extra: '3'},
              {value: 4, text: '赵六', extra: '4'},
          ],
      }
    },
    methods: {
      mySearch({keyword,fullOptions,currentValue,pager}) {
        console.log(TAG, {keyword, fullOptions, currentValue, pager});
        // 这里可以请求服务端异步搜索和加载
        return new Promise((resolve, reject) => {
          // 模拟服务端响应
          setTimeout(()=>{
            const arr = [];
            const n = Math.ceil(Math.random()*10);
            for (let i = 0; i < n; i++) {
              arr.push({
                value: `${keyword}-${i}`,
                text: `${keyword}-${i}`,
              })

            }
            resolve(arr);
          })
        })
      },
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
| value / v-model | 绑定值 | boolean / string / number | — | — |


#### Events
| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------|
| change | 选中值发生变化时触发 | 目前的选中值 |
| visible-change | 下拉框出现/隐藏时触发 | 出现则为 true，隐藏则为 false |
| remove-tag | 多选模式下移除tag时触发 | 移除的tag值 |
| clear | 可清空的单选模式下用户点击清空按钮时触发 | — |
| blur | 当 input 失去焦点时触发 | (event: Event) |
| focus | 当 input 获得焦点时触发 | (event: Event) |


#### Slots
|   name  | 说明     |
|---------|---------|
|    —    | Option 组件列表 |
| prefix  | Select 组件头部内容 |
| empty | 无选项时的列表 |