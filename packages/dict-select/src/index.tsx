/**# 字典值下拉选择框 #
 * 简化字典值下拉框, 实现传入一个后端枚举类全类名或字典值编码, 自动加载选项集, 渲染下拉框.
 * 组件创建时加载选项集.
 *
 * ## 版本
 * > 2021年2月5日 dafei
 * 支持 dictTable 和 dictCode 字典项查询.
 *
 * > 1.0.2 2021年1月22日 dafei
 * fix: this.$message.warn(res.message)
 *
 * > 2021年1月28日 dafei
 * feat: excludes 功能.
 *
 * > 1.0.1 2020年11月12日 dafei
 * feat: 可手动指定选项集. 手动指定选项集 >> enumClass >> dictCode
 *
 * > 1.0.0 2020年10月29日 dafei
 */

import {wrapPromise} from "@yongheui/utils/util";
import { Select } from "ant-design-vue";

const TAG = '[YDictSelect]';

export default {
  name: "YDictSelect",
  components: {ASelect: Select, ASelectOption: Select.Option,},
  props: {
    value: {
      type: [String, Number]
    },
    /**
     * 加载选项集API
     */
    loadOptions: {
      type: Function,
    },
    // /**
    //  * 枚举类全类名
    //  *
    //  * enumClass > dictTable > dictCode
    //  */
    // enumClass: {
    //   type: String,
    // },
    // /**
    //  * 字典表
    //  *
    //  * 某些字典项较多的会单独一张表.
    //  * 虽然, 可以随意指定字典项的 id 和 text 等字段名.
    //  * 但, 此组件只支持规范字段名: 请和表 `sys_dict_item` 保持基本一致.
    //  * enumClass > dictTable > dictCode
    //  * */
    // dictTable: {
    //   type: String,
    // },
    // /**
    //  * 字典代号
    //  * 如: `platform_id` 代表平台的字段集. 有 淘宝,天猫,京东等. 见表 `sys_dict`.
    //  * 具体枚举项在表 `sys_dict_item`.
    //  * 优先用 `enumClass`.
    //  * enumClass > dictTable > dictCode
    //  */
    // dictCode: {
    //   type: String,
    // },
    /**
     * 选项集合, {value, text, extra}.
     * options > loadOptions
     */
    options: {
      type: Array,
    },
    /**需要排除的 value , 远程加载options时有效.*/
    excludes: [String, Array],
  },
  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },
  data() {
    return {
      ioptions: this.options || [],
    }
  },
  computed: {
    iexcludes() {
      if (!this.excludes) {
        return [];
      }
      if (typeof this.excludes === 'string') {
        return this.excludes.split(/\s*,\s*/);
      }
      return this.excludes;
    }
  },
  watch: {
    'value': {
      immediate: true,
      handler: function (newVal) {
        console.log(TAG, ' watch `value` change', newVal);
        this.ivalue = newVal;
      }
    },
    options(v) {
      this.ioptions = v;
    }
  },
  created() {
    console.log(TAG, 'created');
    if (this.ioptions && this.ioptions.length > 0) {
      // 优先使用指定的
    }
    else if(this.loadOptions) {
      const loadDictOptionsFunc = wrapPromise(this.loadOptions/*, {
        enumClass: this.enumClass,
        dictTable: this.dictTable,
        dictCode: this.dictCode,
      }*/);
      loadDictOptionsFunc.then(res => {
        if (res) {
          this.ioptions = res;
          if (this.iexcludes) {
            this.ioptions = this.ioptions.filter(e => {
              return this.iexcludes.indexOf(e.value) == -1;
            })
          }
        } else {
          console.error(TAG, "加载字典选项集异常", res);
        }
      });
    }

  },
  emits: ['change', 'update:value'],
  methods: {
    handleChange(e, option) {
      console.log(TAG, 'change', e, option);
      this.$emit('change', e, option);
      this.$emit('update:value', e, option);
    },
  },
  render() {
    console.log(TAG, this);
    const { handleChange } = this;
    const prps = {
      // props: {...this.$props},
      attrs: {...this.$attrs}, // 坑: this.$attrs 不知怎么的, 某个时机会被清空, 所以需要复制一份
      // on: {
      //   ...$listeners,
      //   change: handleChange,
      // },
      onChange: handleChange,
      slots: this.$slots,
      // scopedSlots: this.$scopedSlots,
    };
    return (
      <a-select v-model={this.ivalue} {...prps}>
        {
          this.ioptions.map((item, index) => {
            let value = item.value;
            let text = item.text;
            let extra = item.extra;
            let optDom;
            if (this.$slots.default) {
              optDom = this.$slots.default(item);
            } else {
              if (extra) { // 有额外提示
                optDom = <span>{text}<span class="option-tip">{extra}</span></span>;
              } else {
                optDom = text;
              }
            }

            return (<a-select-option key={value} value={value} data={item} index={index}>{optDom}</a-select-option>)
          })
        }

      </a-select>
    )
  }
}
