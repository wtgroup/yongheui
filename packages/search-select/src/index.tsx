/**
 * 为解决普通下拉框选项多导致渲染慢的问题. 1000个item约3s.
 * 默认只展示少量的选项集.
 *
 * ## 特性
 * -> $scopedSlots.default 在 a-select-option 下渲染.
 *
 * ## 版本
 * -- v2.0.0 2021年2月8日 dafei --
 * - 升级失败 vue3 和 antd 2.0
 * - 默认搜索逻辑加入 `value` .
 *
 * -- v1.0.1 2020-10-29 dafei --
 * -> ref: 字段别名名称修改. 由 value, label, label2,... --> value, text, extra .
 * -> perf: 连续输入处理优化: 由不断清除旧的定时器, 改为, 保持旧的不新建, 保证关键词最新.
 * ~~-> perf: 全量选项集空时, 默认塞入最近一个回填的有效选项.~~
 *
 *
 * -- v1.0 2020-5-7 --
 *
 * @see [antd select](https://www.antdv.com/components/select-cn/#API)
 * @see https://blog.csdn.net/liuyuhua666/article/details/103703478
 * @author dafei
 * @date 2020/5/6 12:37
 */

// babel-plugin-import 会帮助你加载 JS 和 CSS
import { Select } from "ant-design-vue";
import _ from 'lodash'
import {wrapPromise, pickValueAdapt} from "../../utils/util"

const TAG = "[YSearchSelect]"

// 字符串常量
const StringPool = {
  key: 'key',
  value: 'value',
  text: 'text',
  extra: 'extra',
  change: 'change',
};

// 默认字段名
const ReplaceFields = {
  key: StringPool.value, // dom 渲染的key
  value: StringPool.value,
  text: StringPool.text,
  extra: StringPool.extra,
};

export default {
  name: "YSearchSelect",
  components: {ASelect: Select, ASelectOption: Select.Option,},
  props: {
    // /**选中的选项需要放入 viewOptions 中*/
    // checkedOption:{
    //   type:Object,
    // },
    /**默认 viewOptions, 备选
     * 函数入参: fullOptions
     * */
    defaultOptions: {
      type: [Function, Array],
    },
    fullOptions: {
      type: [Function, Array],
    },
    /**默认情况下展示的选项数量*/
    defaultLimit: {
      type: Number,
      default: 10,
    },
    /**格式:
     * {
     *   value:'value', // 字符串对应自定义节点对象的key
     *   text:(item,index,fieldName)=>{}  // 支持函数取值
     * }
     */
    replaceFields: {
      type: Object,
    },
    /**
     * 定制搜索逻辑.
     * ASelect 'onsearch' 触发.
     * 可以是获取搜索后选项的逻辑, 也可以直接传入搜索后的选项集.
     * 函数逻辑可以同步, 可以异步(Promise).
     * 缺省, 已有全量选项集中模糊匹配满足条件的最多一页选项集.
     * 若果是函数, 回调参数: {keyword,fullOptions,currentValue,pager}, 返回匹配的选项集.
     */
    search: {
      type: [Function, Array]
    },
    /**
     * 输入关键词后延迟多久执行搜索
     *
     * 500ms延迟后执行搜索匹配逻辑
     * 值越小, 卡顿几率越大.
     * */
    searchDelay: {
      type: Number,
      default: 500,
    },
    enableScrollPage: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Number]
    },
  },
  watch: {
    value(val) {
      console.log(TAG, 'watch value chagne::', val);
      this.ivalue = val
      // // 选项改变后, 强行修改, checkedOption
      // this.icheckedOption = this.getCheckedOption(val)
      // this.$nextTick(() => {
      //   this.viewOptions = this.getDefaultOptions()
      // })

      // // 只保留一个, 多个的话有点麻烦, 信息不全, 保留最近选中的值
      // if (val && this.lastNonNullOptions) {
      //   let that = this;
      //   this.lastNonNullOptions = [{
      //     [that.ireplaceFields[StringPool.value]]: val,
      //     [that.ireplaceFields[StringPool.text]]: val,
      //   }];
      // }
    },
    fullOptions(val) {
      this.viewOptions = this.getDefaultOptions()
    },
    defaultOptions() {
      this.$nextTick(() => {
        this.viewOptions = this.getDefaultOptions()
      })
    },
    // checkedOption(val) {
    //   this.icheckedOption = val;
    // }
  },
  computed: {
    // 渲染最终用的数据集
    // 对viewOptions加工. 主要是为了始终包含选中项
    viewOptionsWrap() {
      let arr = [].concat(this.viewOptions)
      if (this.ivalue && !this.keyword) { // 有搜索词时, 只显示匹配的结果
        let t = arr.find((item) => {
          return this.ivalue == this.getFieldValue(item, StringPool.value)
        })
        if (t == null) {
          let ckopt = this.icheckedOption = this.getCheckedOption(this.ivalue)
          if (ckopt) arr.unshift(ckopt) // ! 比设置的limit多一个选项 !
        }
      }
      return arr;
    }
  },
  data() {
    return {
      // 临时的, 动态的. 比如搜索时, 会即时改变
      viewOptions: this.getDefaultOptions(),
      ivalue: this.value,
      // 历史记录, 最近有值时, 封装的选项, 用于候选项集时用此填充
      lastNonNullOptions: [],
      timeout: undefined,
      pager: {
        pageNo: 1,
        pageSize: this.defaultLimit,
      },
      keyword: '',
      ireplaceFields: Object.assign({}, ReplaceFields, this.replaceFields),
      icheckedOption: undefined,
    }
  },
  created() {
  },
  emits: {
    change: (args) => {
      // console.log(TAG, 'emits change:', args);
      return true;
    },
    'update:value': (args) => {
      // console.log(TAG, 'emits update:value:', args);
      return true;
    },
    dropdown: null,
  },
  setup(props, {emit}) {
    const triggerChange = (...args: any[]) => {
      emit('update:value', ...args);
      emit('change', ...args);
    };
    return {
      triggerChange,
    }
  },
  methods: {
    handleSearch(val) {
      let that = this;
      console.log(TAG, 'handleSearch::', val)
      that.keyword = val;
      if (!val) {
        // 没有值, 不执行搜索逻辑, 清除 timeout 定时器
        that.killTimeOut();
        return
      }

      // 每次触发清除旧的触发器. 不间歇输入就不会触发搜索匹配逻辑, 避免卡顿.
      // 抬起键盘500ms后才触发一次搜索匹配.
      if (this.timeout) {
        // 已有定时器, 什么也不做
        return;
      }
      this.timeout = setTimeout(() => {
        that.exeSearch(that.keyword); // 取最新的 keyword 保证每次到执行搜索逻辑时用的是最近的输入值
        // 执行完后, 自杀
        that.killTimeOut();
      }, that.searchDelay)

    },
    // 清除定时执行器
    killTimeOut() {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    },
    exeSearch(keyword) {
      // console.log('exeSearch::', keyword);
      if (this.search) {
        wrapPromise(this.search, {
          keyword: keyword,
          fullOptions: this.getFullOptions(),
          currentValue: this.ivalue, // 当前选项的 value
          pager: this.pager,
        })
          .then(res => {
            // 搜索返回匹配新的选项集, 更新
            this.viewOptions = res
          });
      } else {
        // 默认在 fullOptions 中匹配到top#个
        let fops = this.getFullOptions()
        let matches = []
        let len = Math.min(this.pager.pageNo * this.pager.pageSize, fops.length)

        for (let i = 0; matches.length < len && i < fops.length; i++) {
          let it = fops[i]
          if (it == null) {
            console.log(it, i)
          }
          let value = this.getFieldValue(it, StringPool.value) || '';
          let label = this.getFieldValue(it, StringPool.text) || '';
          let label2 = this.getFieldValue(it, StringPool.extra) || ''

          let text = (value + label + label2).toLowerCase()

          if (text.indexOf(keyword.toLowerCase()) > -1) {
            matches.push(it)
          }
        }

        this.viewOptions = matches
        console.log("matches size: ", matches.length)
      }
    },
    handleChange(val, option) {
      console.log(TAG, 'handleChange::', val, option)
      this.ivalue = val;
      // this.$emit(StringPool.change, val, option)
      this.triggerChange(val, option)
    },
    // 失去焦点后, 恢复成默认选项集
    handleBlur() {
      this.viewOptions = this.getDefaultOptions()
      this.pager.pageNo = 1
    },

    // !! 目前翻页时不稳定的, 它会受下拉弹层高度影响. 暂不可据此动态异步更新数据
    handleScroll(e) {
      // console.log('handleScroll::', e)
      // e.persist();
      const {target} = e;
      const rmHeight = target.scrollHeight - target.scrollTop; // 上边缘以下的内容高度
      const clHeight = target.clientHeight;
      // console.log('handleScroll', e, rmHeight, clHeight)
      if (rmHeight === 0 && clHeight === 0) { // 没有内容
        // console.log('没有触发翻页')
      } else if (target.scrollTop <= 0) { // 这里可以实现向上翻页
        // this.pager.pageNo -= 1
        // console.log('上一页', this.pager.pageNo)
      } else {
        if (rmHeight < clHeight + 5 && !this.pageScrolled) { // 差额在 5px 以内会触发好几次
          this.pager.pageNo += 1;
          this.pageScrolled = true;
          console.log('下一页', this.pager.pageNo, rmHeight, clHeight);
          // 追加一页数据
          this.loadOptions(this.pager)

        } else {
          this.pageScrolled = false
        }
      }
      // console.log(e.target)
    },

    handleDropdownVisibleChange(open) {
      // console.log('handleDropdownVisibleChange::', open)
      if (open) {
        this.$emit('dropdown')
      }
    },
    handleFocus(e) {
      // console.log('handleFocus::', e)
    },

    loadOptions({pageNo, pageSize}) {
      // 有搜索词时, 需要在匹配出 len 数量的选项
      if (this.keyword) {
        this.exeSearch(this.keyword)
      } else {
        let len = Math.min(this.getFullOptions().length, pageSize * pageNo)
        this.viewOptions = _.take(this.getFullOptions(), len)
      }
    },

    getCheckedOption(value) {
      if (value == null) {
        return undefined
      }
      let that = this;
      let fos = this.getFullOptions();
      return fos.find(e => {
        return that.getFieldValue(e, StringPool.value) == value
      });
    },

    getFullOptions() {
      let that = this;
      let fops = [];
      if (this.fullOptions) {
        fops = pickValueAdapt(this.fullOptions) || [];
      }

      return fops;
    },
    // fullOptions 空时, 填充上历史有效记录
    getFullOptionsWrap() {
      let fops = this.getFullOptions();
      // if (fops.length == 0 && this.lastNonNullOptions && this.lastNonNullOptions.length > 0) {
      //   // 没有全量选项集时, 若有最初的选项值(回显的), 放入
      //   fops.push(...this.lastNonNullOptions);
      // }

      return fops;
    },

    // 保证使用含有选中项
    getDefaultOptions() {
      let arr, ckVal;

      if (this.defaultOptions) {
        arr = pickValueAdapt(this.defaultOptions, this.getFullOptions()) || [];
      } else {
        arr = _.take(this.getFullOptionsWrap(), this.defaultLimit);
      }

      return [].concat(arr);
    },

    getFieldValue(item, field, index) {
      if (item == null) {
        return undefined
      }
      let alias = this.ireplaceFields[field];
      if (_.isFunction(alias)) {
        return alias(item, index, field)
      }

      return item[alias]
    }
  },

  render() {
    let pickVal = this.getFieldValue;

    let jsx = (
      <a-select
        show-search
        value={this.ivalue}
        {...{props: this.$attrs, attrs: this.$attrs}}
        filter-option={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onPopupScroll={this.enableScrollPage ? this.handleScroll : () => {
        }}
        onDropdownVisibleChange={this.handleDropdownVisibleChange}
        onFocus={this.handleFocus}
      >
        {
          this.viewOptionsWrap.map((item, index) => {
            let key = pickVal(item, StringPool.key, index)
            let value = pickVal(item, StringPool.value, index)
            let label = pickVal(item, StringPool.text, index)
            let label2 = pickVal(item, StringPool.extra, index)
            let optDom
            if (this.$slots.default) {
              optDom = this.$slots.default(item)
            } else {
              if (label2) { // 有提示
                optDom = <span>{label}<span class="y-option-tip">{label2}</span></span>
              } else {
                optDom = label
              }
            }

            return (<a-select-option key={key} value={value} data={item} index={index}>{optDom}</a-select-option>)
          })
        }
      </a-select>
    )

    return jsx
  },


}
