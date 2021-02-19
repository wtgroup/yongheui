## LightButton 轻按钮

### 基本用法

:::demo
```html
<template>
  <y-light-button @click="clickEvent('基本按钮')">基本按钮</y-light-button>
  <y-light-button type="primary" @click="clickEvent('primary')">primary</y-light-button>
  <y-light-button type="danger" @click="clickEvent('danger')">danger</y-light-button>
</template>
<script>
  export default {
    methods: {
        clickEvent(t) {
          console.log(t);
      }
    }
  }
</script>
```
:::


### 带前/后缀

:::demo
```html
<template>
  <y-light-button @click="clickEvent('带前后缀')">
    <template v-slot:prefixIcon>🙂</template>
    带前后缀
    <template v-slot:suffixIcon>😂</template>
  </y-light-button>
</template>
<script>
  export default {
    methods: {
        clickEvent(t) {
          console.log(t);
      }
    }
  }
</script>
```
:::


### API

#### Slots
|   name  | 说明     |
|---------|---------|
|    —    | 按钮显示内容 |
| prefixIcon | 前缀图标 |
| suffixIcon | 后缀图标 |




