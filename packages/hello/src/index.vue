

<script>
import {defineComponent, ref} from 'vue'

export default defineComponent({
  name: 'YHello',
  props: {
    msg: {
      type: String,
      default: '我是一棵葱, 来自外太空!'
    }
  },
  /*setup(props) {
    const count = ref(0);
    setInterval(() => {
      count.value++;
    }, 1000)

   return ()=>{
      return (
        <div class="y-hello">
          <h4 class="y-hello__title">Hello `YHello` !!!</h4>
          <div class="y-hello__msg">{ props.msg }</div>
          <div style="font-weight: bold">count : { count }</div>
        </div>
      )
   }
  }*/

  setup() {
    const count = ref(0);
    setInterval(() => {
      count.value++;
    }, 1000)

    return {
      count,
    }
  },
  // render 方法中使用 jsx OK
  render() {
    const props = this.$props;
    // const count = 0;
    return (
      <div class="y-hello">
        <h4 class="y-hello__title">Hello `YHello` !!!</h4>
        <div class="y-hello__msg">{props.msg}</div>
        <div style="font-weight: bold">count : {this.count}</div>
      </div>
    )
  }
})


</script>
