<template>
    <div class="sq-hello">
        Hello `SqHello` !!!
        <span style="color: red">{{msg}}</span>
        <span style="font-weight: bold">count : {{count}}</span>
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
