<template>
    <div class="y-hello">
        <h4 class="y-hello__title">Hello `YHello` !!!</h4>
        <div class="y-hello__msg">{{msg}}</div>
        <div style="font-weight: bold">count : {{count}}</div>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'YHello',
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
