<template>
    <div class="sq-hello">
        <h4 class="sq-hello__title">Hello `SqHello` !!!</h4>
        <div class="sq-hello__msg">{{msg}}</div>
        <div style="font-weight: bold">count : {{count}}</div>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'SqHello',
  props: {
    msg: {
      type: String,
      default: '我是一棵松'
    }
  },
  setup() {
    const count = ref(0);
    setInterval(()=>{
      count.value++;
    }, 1000)

   return {
      count,
   }
  }
})


</script>
