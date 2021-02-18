/**
 * 简单轻按钮
 *
 *
 * 定制悬浮样式可利用 active class .
 * @author dafei
 * @date 2019/12/19 10:29
 */

import {Icon} from 'ant-design-vue';
const TAG = 'YLightButton';

export default {
  name: "YLightButton",
  components:{AIcon: Icon},
  props: {
    // 按钮类型: default, primary, danger
    type: {
      type: String,
      default: 'default',
    },
    // /**antd vue 的icon类别*/
    // prefixIcon: {
    //   type: String,
    //   required: false,
    // },
    // /**antd vue 的icon类别*/
    // suffixIcon: {
    //   type: String,
    //   required: false,
    // },
    customButtonStyle: {
      type: [Object, String],
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      isHover: false,
    }
  },
  emits: [
    'click'
  ],
  methods: {
    click() {
      this.$emit('click');
    },
    mouseenter() {
      this.isHover = true;
    },
    mouseleave() {
      this.isHover = false;
    },
    calcMargin() {
      return {
        'margin-left': this.$slots.prefixIcon ? '8px' : 0,
        'margin-right': this.$slots.suffixIcon ? '8px' : 0,
      }
    },
    renderPrefixIcon() {
      if (this.$slots.prefixIcon) {
        return this.$slots.prefixIcon();
      }
      // return this.prefixIcon ? <a-icon type={this.prefixIcon}/> : '';
    },
    renderSuffixIcon() {
      if (this.$slots.suffixIcon) {
        return this.$slots.suffixIcon();
      }
      // return this.suffixIcon ? <a-icon type={this.suffixIcon}/> : '';
    },
  },
  render() {
    // console.log('this.$slots.default', this.$slots.default);
    // console.log(TAG, this.$slots);
    return (
      <div onClick={this.click} style={this.customButtonStyle}
           onMouseenter={this.mouseenter} onMouseleave={this.mouseleave}
           class={['y-button', this.type + ' ' + (this.isHover ? 'active' : '')]}>
        {this.renderPrefixIcon()}
        {
          this.$slots.default ?
            (<div class="y-button__text" style={this.calcMargin()}>
              {this.$slots.default()}
            </div>) : ''
        }
        {this.renderSuffixIcon()}
      </div>
    )
  }
}
