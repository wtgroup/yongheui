<!-- 可嵌套编辑sql条件 -- dafei 2019/12/18 10:52 -->
<template>
  <div class="nc-group">
    <!--组标题-->
    <div class="nc-group-head-line">
      <span class="nc-group-title">
        <!--<a-icon @click="dataSource.fold = !dataSource.fold" class="nc-plus-minus-icon"
                :type="isShow(dataSource)?'plus':'minus'"/>-->
        <span @click="dataSourceRef.fold = !dataSourceRef.fold" class="nc-plus-minus-icon">
          <PlusOutlined v-if="isShow(dataSourceRef)" />
          <MinusOutlined v-else />
        </span>
        <span class="nc-group-title__text">{{getGroupName(dataSourceRef)}}</span>
      </span>
      <div>
        <!--<a-button @click="appendGroup(dataSource)" icon="plus-circle" size="small">新增组</a-button>-->
        <YLightButton v-if="getGroupLevel(dataSourceRef.id) < maxDepth" class="plus-btn"
                      @click="appendGroup(dataSourceRef)">
          <template #prefixIcon>
            <PlusCircleOutlined/>
          </template>
          新增组
        </YLightButton>
        <!--<a-button v-if="isRoot" @click="appendCriterion" icon="plus-circle" size="small">新增条件</a-button>-->
        <YLightButton class="plus-btn" v-if="isRoot" @click="appendCriterion">
          <template #prefixIcon>
            <PlusCircleOutlined/>
          </template>
          新增条件
        </YLightButton>
        <YLightButton v-if="!isRoot()" type="danger" @click="$emit('delete')">
          <template #suffixIcon><CloseOutlined /></template>
        </YLightButton>
      </div>
    </div>

    <transition name="criterion">
      <div v-if="dataSourceRef.children && dataSourceRef.children.length > 0" class="nc-container" v-show="isShow(dataSourceRef)">
        <div class="nc-relation" @click="changeJoin"><span :class="dataSourceRef.join=='and'?'and':'or'">{{dataSourceRef.join=='and'?'且':'或'}}</span></div>
        <ul class="nc-list">
          <li v-for="(crite, i) in dataSourceRef.children" :key="i">
            <div v-if="isGroup(crite)">
              <YNestCriterion ref="childNc" :data-source="crite" :criterion-options="criterionOptions" :seq="getSeq(i)"
                              :level="childLevel"
                              @validated="onChildGroupValidated"
                              @change="onChildChange"
                              @delete="deleteGroup(i)"></YNestCriterion>
            </div>

            <!--optionFilterProp="children" -->
            <div v-else class="nc-criterion__item">
              <div class="nc-criterion__item__content">
                <a-select :defaultValue="crite.id" v-model:value="crite.id" @change="handleCriteIdChange(crite)"
                          placeholder="请选择"
                          showSearch :filterOption="filterOption"
                          :style="{width: width/4+'px', 'margin-right':'5px'}">
                  <!--<a-icon slot="suffixIcon" type="smile"/>-->
                  <template #suffixIcon><SmileOutlined /></template>
                  <a-select-option v-for="(e,i) in criterionOptions" :key="e.id" :value="e.id" :data="e">
                    <a-tooltip placement="right">
                      {{e.title}}
                      <span class="y-option-tip">{{e.id}}</span>
                      <template #title>
                        {{e.title}}
                        <span class="y-option-tip">{{e.id}}</span>
                        <span class="y-option-tip">[{{e.fieldType_dictText}}]</span>
                      </template>
                    </a-tooltip>
                  </a-select-option>
                </a-select>
                <a-select :defaultValue="crite.operator" v-model:value="crite.operator"
                          placeholder="操作符"
                          @change="onOperatorChange"
                          :style="{width: width/4+'px', 'margin-right':'5px'}">
                  <a-select-option v-for="(e,i) in getOperatorOptions(crite)" :key="e.value" :value="e.value">
                    {{e.text}}<span class="y-option-tip">{{e.value}}</span>
                  </a-select-option>
                </a-select>
                <div v-if="!isOneSideOpt(crite.operator)" :style="{display: 'inline-block', width: width/3+'px'}">
                  <!--1 单值 2 范围-->
                  <template v-if="crite.operator == OperatorEnum.between">
                    <ValueBetweenInputSelect v-model:value="crite.value" :criterion="crite" @validated="onInputValidated"
                                             @change="onValueChange" style="width: 100%"></ValueBetweenInputSelect>
                  </template>
                  <!--多值 && 枚举类型-->
                  <template v-else-if="crite.operator == OperatorEnum.in && crite.valType == ValType.Scatter">
                    <TagSelect v-model:value="crite.value" :criterion="crite" @change="onValueChange" style="width: 100%"></TagSelect>
                  </template>
                  <ValueInputSelect v-else v-model:value="crite.value" :criterion="crite" @validated="onInputValidated"
                                    @change="onValueChange" style="width: 100%"></ValueInputSelect>
                  <!--<a-select v-if="isSelectVal(crite)" v-model="crite.value" placeholder="请选择">
                    <a-select-option v-for="(e,i) in crite.options" :key="e.value" :value="e.value">{{e.text}}</a-select-option>
                  </a-select>
                  <a-input v-else :placeholder="getInputTip(crite)" :defaultValue="crite.value" :class="crite.value__validateMsg?'nc-criterion__value invalid':''"
                           v-model="crite.value" @keyup="validateValue(crite, $event)" />-->
                </div>
                <a-tooltip v-if="forceFlag && getInputTip(crite)" placement="rightTop">
                  <template #title>
                    <span>{{getInputTip(crite)}}</span>
                  </template>
                  <!--<a-icon style="color: #c0ccda; margin-left: 10px" type="question-circle"/>-->
                  <QuestionCircleOutlined style="color: #c0ccda; margin-left: 10px" />
                </a-tooltip>
                <span v-if="crite[VALIDATE_MSG]" class="nc-criterion__validate-msg">
                  {{crite[VALIDATE_MSG]}}
                </span>
              </div>
              <div class="nc-criterion__bg">
                <!--<a-button v-if="i==dataSource.children.length-1" @click="appendCriterion" icon="plus-circle"
                          size="small">新增
                </a-button>-->
                <YLightButton class="plus-btn" v-if="i==dataSourceRef.children.length-1" @click="appendCriterion">
                  <template #prefixIcon><PlusCircleOutlined /></template>
                  新增
                </YLightButton>
                <YLightButton type="danger" @click="deleteCriterion(i)"><template #suffixIcon><CloseOutlined /></template></YLightButton>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
  /**
  * 每个条件组默认会有一个条件, 没有条件的条件组自动 删除 , 不允许没有条件的 条件组存在.
  * 组标题行后的 新增/插入条件组 新增下一级组.
  * 新增 都是新增 兄弟. 条件后新增增加兄弟条件; 组后新增新增兄弟组. (组标题行可以去掉 新增 , 统一由父级组新增它的兄弟).
  *
  * Criterion(条件) ; CriterionGroup(条件组)
  * Criterion:{id, title, operator, value, type}
  * CriterionGroup:{id, title, children[],}
  *   children[] 中至少一个 Criterion , 及若干个 CriterionGroup
  *
  * 每个组内, 当需要创建下级组时, 已有的条件需要归并成组, 这样看起来整洁些. 就是说, 一个组内要么都是条件, 要么都是条件组. -M->
  *   可以条件和组混合, 但保持, 在第一个是条件的情况下新增组, 前面和自动归并.
  *
  * 组id: 根据次序和层级动态变化, 如, 1, 1.1, 2.3.4, ...
  * 组名: 默认 '组 '+组id, 但允许自定义名称.
  * 默认情况, 组 title 字段置空, 有自定义时才填充.
  *
  * ## CHANGELOG ##
  * - 升级为 vue3
  * - name -> title
  */

  import {defineComponent, getCurrentInstance, ref, reactive, toRefs} from 'vue';
  import YButton from '@yongheui/button';
  import { Select, Button, Tooltip, Input } from "ant-design-vue";
  import {
    QuestionCircleOutlined,
    SmileOutlined,
    PlusOutlined,
    MinusOutlined,
    CloseOutlined,
    PlusCircleOutlined,
  } from '@ant-design/icons-vue';
  import {useCrudCriterion} from "./useCrudCriterion";

  import {
    TAG, ID_PATH_SEP, COMMA, VID, AND, OR, VALIDATE_MSG, ROOT,
    OperatorEnum, FieldType, ValType,
    operatorOptions, BoolOptions,
    NumberReg,
    MultiNumberReg,
    BoolReg,
    MultiBoolReg,
    EMITS,
  } from './consts'
  import {isGroup, recursiveExec} from './tool';
  import {isEmpty} from '@yongheui/utils/util';

  const nextId = function () {
    var current_id = 0;
    return function () {
      return ++current_id;
    }
  }()

  const handleDataSource = function (ds) {
    if (ds.children.length === 0) {
      return
    }
    // let pvid = ds[VID] == null ? '' : ds[VID];
    ds.children.forEach(item => {
      if (item[VID] == null) {
        item[VID] = nextId()
      }
      if (item.children && item.children.length) {
        handleDataSource(item)
      }
    })
  }

  // 字段类型提示 + 操作符提示 + 备注
  const getInputTip = function (crite) {
    let msg = ''
    // 单侧操作符
    if (crite.operator == OperatorEnum.isNull || crite.operator == OperatorEnum.notNull) {
      if (crite.fieldType == FieldType.String && crite.operator == OperatorEnum.isNull) {
        msg = "字符空: NULL 或 ''"
      }
      if (crite.fieldType == FieldType.String && crite.operator == OperatorEnum.notNull) {
        msg = "字符非空: NOT NULL 且 != ''"
      }

      return msg;
    }

    let multiMsg = "可输入多值, 英文','分割";
    msg = (crite.operator == OperatorEnum.in || FieldType.isArray(crite.fieldType)) ? multiMsg : '';
    if (crite.fieldType == FieldType.Number) {
      msg = "请输入数字" + (msg ? ", " + msg : '');
    }
    if (crite.fieldType == FieldType.Bool) {
      msg = "请输入布尔值: 'true'或'false'" + (msg ? ", " + msg : '');
    }
    // if (crite.fieldType == FieldType.Array) {
    //   // to do 限定数字元素类型时, 需要根据内部类型给不同提示
    //   msg = multiMsg;
    // }


    if (crite.remark) {
      msg += (msg ? ". " : "") + crite.remark
    }

    return msg;
  }
  const isSelectVal = function (crite) {
    return crite.valType == ValType.Scatter || crite.valType == ValType.Bool
  }

  const ValueInputSelect = {
    name: 'ValueInputSelect',
    props: {
      criterion: {
        type: Object,
      },
      value: {
        type: [Number, String, Boolean],
      }
    },
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    watch: {
      'value': {
        immediate: true,
        handler: function (newVal) {
          this.ivalue = newVal;
          // 这是修改'值'的最小单元, 这里改了立即触发校验, 并将结果上报. 避免错误值因为没有keyup触发而误认为是有效值.
          // 另, nextTick 执行, 否则可能抛 typeError: Cannot read property 'allowRecurse' of null , 原因不详.
          this.$nextTick(() => {
            if (newVal != null) {
              this.validateValue(this.criterion, newVal);
            }
          })
        }
      }
    },
    data() {
      return {
        VALIDATE_MSG,
        ivalue: this.value,
        valueValid: true, // !! 巨坑, $refs.nc 直接取值还是调用方法取值, 都取不到更新后的值 !!
      }
    },
    emits: [EMITS.CHANGE, EMITS.UPDATE_VALUE, EMITS.VALIDATED],
    methods: {
      getInputTip,
      validateValue(crite, e) {
        // console.log(TAG, 'validateValue::', crite, e);
        if (e == null) {
          return;
        }

        let isMulti = crite.operator == OperatorEnum.in;
        let isOk = true;
        let tip = '';
        // let val = crite.value;
        let val = (e.target) ? e.target.value : e;
        switch (crite.fieldType) {
          case FieldType.Bool:
            // isOk = isMulti ? MultiBoolReg.test(val) : BoolReg.test(val);
            if (isMulti) {
              isOk = MultiBoolReg.test(val);
              if (!isOk) tip = '请输入如: true,false,...'
            } else {
              isOk = BoolReg.test(val);
              if (!isOk) tip = '请输入如: true 或 false'
            }
            break;
          case FieldType.Number:
            if (isMulti) {
              isOk = MultiNumberReg.test(val);
              if (!isOk) tip = '请输入如: 123,456,...'
            } else {
              isOk = NumberReg.test(val);
              if (!isOk) tip = '请输入如: 123'
            }
            break;
          case FieldType.String:
            // 随意
            break;
          case FieldType.ArrayBool:
            isOk = MultiBoolReg.test(val);
            break;
          case FieldType.ArrayNumber:
            isOk = MultiNumberReg.test(val);
            break;
          case FieldType.ArrayString:
            // 随意
            break;
        }

        this.valueValid = isOk;

        // this.$set(crite, VALIDATE_MSG, tip);
        crite[VALIDATE_MSG] = tip;
        // console.log('ValueInputSelect:validateValue', this.valueValid, crite)
        this.$emit(EMITS.VALIDATED, this.valueValid, crite)
        // this.$forceUpdate()
      },
      onSelectChange(e) {
        // console.log(TAG, 'ValueInputSelect::onSelectChange', e);
        this.$emit(EMITS.UPDATE_VALUE, e, 'value:select')
        this.$emit(EMITS.CHANGE, e, 'value:select')
      },
      onInputChange(e) {
        // console.log(TAG, 'ValueInputSelect::onInputChange', e);
        this.$emit(EMITS.UPDATE_VALUE, e.target.value, 'value:input')
        this.$emit(EMITS.CHANGE, e.target.value, 'value:input')
      }
    },
    render() {
      // console.log('ValueInputSelect render')
      let jsx
      if (isSelectVal(this.criterion)) {
        jsx = (
          <a-select value={this.ivalue} onChange={this.onSelectChange} placeholder="请选择" style="width: 100%">
            {
              this.criterion.options.map(e => {
                return <a-select-option key={e.value} value={e.value}>{e.text}<span class="y-option-tip">{e.value}</span>
                </a-select-option>
              })
            }
          </a-select>
        )
      } else {
        jsx = (<a-input value={this.ivalue} onChange={this.onInputChange} placeholder={this.getInputTip(this.criterion)}
                        class={this.criterion[VALIDATE_MSG] ? 'nc-criterion__value invalid' : ''}
                        onKeyup={e => this.validateValue(this.criterion, e)} style="width: 100%"/>)
      }

      return jsx;
    }
  }

  const ValueBetweenInputSelect = {
    title: 'ValueBetweenInputSelect',
    components: {ValueInputSelect,},
    props: {
      criterion: {
        type: Object,
      },
      value: {
        type: [Number, String, Boolean],
      }
    },
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    watch: {
      'value': {
        immediate: true,
        handler: function (newVal) {
          // console.log("watched", newVal)
          let v = this.splitValue(newVal)
          this.begin = v[0];
          this.end = v[1];
        }
      }
    },
    data() {
      return {
        begin: this.splitValue(this.value)[0],
        end: this.splitValue(this.value)[1],
        validateResult: [],
      }
    },
    emits: [EMITS.CHANGE, EMITS.UPDATE_VALUE, EMITS.VALIDATED],
    methods: {
      joinWithComma(a, b) {
        return (a == null ? '' : a) + COMMA + (b == null ? '' : b);
      },
      splitValue(val) {
        val += ''
        let res = val ? val.split(/\s*,\s*/) : []
        // Del 当只有一个值时, 这里改了, 导致视图和模型不一致
        // if (res.length == 1) {
        //   res[1] = res[0]
        // }
        return res
      },
      onBeginChange(e, eventType) {
        let val = this.joinWithComma(e, this.end)
        this.$emit(EMITS.UPDATE_VALUE, val, eventType += ":begin")
        this.$emit(EMITS.CHANGE, val, eventType += ":begin")
      },
      onEndChange(e, eventType) {
        let val = this.joinWithComma(this.begin, e)
        this.$emit(EMITS.UPDATE_VALUE, val, eventType += ":end")
        this.$emit(EMITS.CHANGE, val, eventType += ":end")
      },
      onBeginValidated(isValid, crite, validateResult) {
        // Object.assign(this.validateResult, validateResult)
        // this.validateResult[0] = isValid
        this.validateResult[0] = crite[VALIDATE_MSG];
        // let flag = !this.validateResult.some(e => e == false)
        let tip = this.validateResult.find(e => e);
        crite[VALIDATE_MSG] = tip; // 避开 begin 和 end 校验结果互相干扰, end 校验通过但 begin 没有, end 会将 msg 错误置空
        // console.log(TAG, 'ValueBetweenInputSelect:onBeginValidated', tip, crite)
        this.$emit(EMITS.VALIDATED, !tip, crite)
        // this.$forceUpdate()
      },
      onEndValidated(isValid, crite, validateResult) {
        // Object.assign(this.validateResult, validateResult)
        // this.validateResult[1] = isValid
        this.validateResult[1] = crite[VALIDATE_MSG];
        // let flag = !this.validateResult.some(e => e == false)
        let tip = this.validateResult.find(e => e);
        crite[VALIDATE_MSG] = tip; // 避开 begin 和 end 校验结果互相干扰
        // console.log(TAG, 'ValueBetweenInputSelect:onEndValidated', tip, crite)
        this.$emit(EMITS.VALIDATED, !tip, crite)
        // this.$forceUpdate()
      }
    },
    render() {
      return (
        <div style="display: flex; flex-direction: row;">
          <ValueInputSelect value={this.begin} onChange={this.onBeginChange} criterion={this.criterion}
                            onValidated={this.onBeginValidated}></ValueInputSelect>
          <span>~</span>
          <ValueInputSelect value={this.end} onChange={this.onEndChange} criterion={this.criterion}
                            onValidated={this.onEndValidated}></ValueInputSelect>
        </div>
      )
    }
  }

  const TagSelect = {
    name: 'TagSelect',
    props: {
      criterion: {
        type: Object,
      },
      value: {
        type: [Number, String, Boolean],
      }
    },
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    watch: {
      'value': {
        immediate: true,
        handler: function (newVal) {
          this.ivalue = this.str2array(newVal);
        }
      }
    },
    data() {
      return {
        ivalue: this.str2array(this.value),
      }
    },
    emits: [EMITS.CHANGE, EMITS.UPDATE_VALUE],
    methods: {
      str2array(str) {
        return str ? str.split(/\s*,\s*/) : [];
      },
      onSelectChange(e) {
        console.log(this.ivalue)
        console.log(e)
        // let s = e && e.join(',');
        this.$emit(EMITS.UPDATE_VALUE, e && e.toString());
        this.$emit(EMITS.CHANGE, e && e.toString(), 'value:tag-select');
      },
    },
    // <a-select v-model="crite.value" mode="multiple" style="width: 100%" @change="onValueChange" :placeholder="getInputTip(crite)" allowClear>
    // <a-select-option v-for="(e,ix) in crite.options || []" :key="e.value" :value="e.value">{{e.text}}<span class="y-option-tip">{{e.value}}</span></a-select-option>
    // </a-select>
    render() {
      return (
        <a-select value={this.ivalue} mode="multiple" allowClear onChange={this.onSelectChange}
                  placeholder={getInputTip(this.criterion)}>
          {
            this.criterion.options.map(e => {
              return <a-select-option key={e.value} value={e.value}>{e.text}<span
                class="y-option-tip">{e.value}</span></a-select-option>
            })
          }
        </a-select>
      )
    }
  }

  export default defineComponent({
    name: "YNestCriterion",
    components: {
      YLightButton: YButton.YLightButton, ValueInputSelect, ValueBetweenInputSelect, TagSelect,
      // ASelect: Select,
      // ASelectOption: Select.Option,
      // AButton: Button,
      // ATooltip: Tooltip,
      // AInput: Input,
      QuestionCircleOutlined,
      SmileOutlined,
      PlusOutlined,
      MinusOutlined,
      CloseOutlined,
      PlusCircleOutlined,
    },
    props: {
      width: {
        type: Number,
        default: 600,
      },
      // /**所在组id, 根组没有id, 可不传*/
      // groupId: {
      //   type: String,
      //   required: false,
      // },
      // join: {
      //   type: String,
      //   default: 'and',
      // },
      /**组的最大深度*/
      maxDepth: {
        type: Number, String,
        default: 3,
      },
      // toolbarTitle: {
      //   type: String,
      //   required: false,
      // },
      /**初始的条件值
       *
       * 可理解为 input | select 组件的 value .
       *
       * [
       *   CriterionGroup, CriterionGroup, ...
       * ]
       * */
      dataSource: {
        type: Object,
        // 默认就一个根组, 一个未配置条件
        default: () => {
          return {
            [VID]: ROOT,
            id: ROOT,
            title: ROOT,
            join: 'and',
            children: [
              {
                id: undefined,
                title: undefined,
                operator: undefined,
                value: undefined,
              }
            ]
          }
        },
        // validator: function(value){
        //   return value != null && value.id != null && value.name != null;
        // }
        // default: () => {
        //   return {
        //     id: ROOT,
        //     name: ROOT,
        //     join: 'and',
        //     children: [
        //       {
        //         id: '1',
        //         name: '大飞的组 1',
        //         join: 'and', // 本组各条件或组的连接方式 且/或
        //         children: [
        //           // 条件组
        //           {
        //             id: '1.1',
        //             name: '大飞的组 1.1',
        //             join: 'and',
        //             children: [
        //               {
        //                 id: 'uname',
        //                 name: '姓名',
        //                 operator: '等于',
        //                 value: '张三',
        //               },
        //               {
        //                 id: 'age',
        //                 name: '年龄',
        //                 operator: '大于',
        //                 value: 18,
        //               },
        //             ]
        //           },
        //           {
        //             id: '1.2',
        //             name: '大飞的组 1.2',
        //             join: 'or',
        //             children: [
        //               {
        //                 id: 'address',
        //                 name: '住址',
        //                 operator: '包含',
        //                 value: '雍和宫',
        //               },
        //               {
        //                 id: 'company',
        //                 name: '公司',
        //                 operator: '在',
        //                 value: ['半塘', '快报', '九天'],
        //               },
        //             ],
        //           }
        //         ],
        //       },
        //       {
        //         id: '2',
        //         name: '大飞的组 2',
        //         join: 'or', // 本组各条件或组的连接方式 且/或
        //         fold: true, // 是否折叠, 保存时什么状态, 下次回显时还能保持该状态
        //         children: [
        //           {
        //             id: 'marriage',
        //             name: '是否已婚',
        //             operator: '等于',
        //             value: true,
        //           },
        //         ]
        //       },
        //       // {
        //       //   id: 'job',
        //       //   name: '工作',
        //       //   operator: '等于',
        //       //   value: '程序员',
        //       // },
        //
        //     ]
        //   }
        // }
      },
      /**条件选项集
       *
       * 待从中选择, 最终生成 dataSource .
       *
       * [ {id,title,fieldType}, ... ]
       */
      criterionOptions: {
        type: Array,
        default: () => {
          return [];
        }
      },
      // 当前组|条件的编号  用于生成组名
      // 内部使用, 用户忽略.
      seq: [Number, String],
      // 当前组|条件所在等级, 由父生成告知  自0始
      // 内部使用, 用户忽略.
      level: {
        type: [Number, String],
        default: 0
      },
    },
    // model: {
    //   prop: 'value',
    //   event: 'change',
    // },
    computed: {
      childLevel() {
        return this.level == null ? 1 : this.level + 1;
      }
    },
    data() {
      return {
        OperatorEnum,
        FieldType,
        ValType,
        forceFlag: true,
        VALIDATE_MSG,
        operatorOptions: operatorOptions,
        criterionOptionsMap: this.criterionOptions2Map(),
        valueValid: true,
        // // 校验结果存储 a/b/c -> true|false
        // validateResult: {},
      }
    },
    watch: {
      criterionOptions(nv, ov) {
        this.criterionOptionsMap = this.criterionOptions2Map();
      },
      // 数据源改变后, 需要加工处理下, 生成 vid
      dataSource(ds) {
        // console.log(TAG, 'dataSource change');
        if (ds[VID] == null) {
          // ds[VID] = ROOT
          ds[VID] = nextId()
        }

        // 没有 id,name 也没有 join, children 时, 设置为组.  这样外面设置初始值是只用 {} 就可以了
        if (!ds.id && !ds.join) {
          ds.join = AND
        }

        handleDataSource(ds);
      }
    },
    created() {
      if (!this.dataSource.children) {
        // this.$set(this.dataSource, 'children', []) // 避免误传参数, 没有children, 导致NPE, children 需要响应式!!
        this.dataSource.children = [];
      }
      handleDataSource(this.dataSource);
    },
    emits: [EMITS.DELETE, EMITS.CHANGE, EMITS.UPDATE_VALUE, EMITS.VALIDATED],
    setup(props, ctx) {
      const vm = getCurrentInstance().proxy;
      // console.log(TAG, 'instance proxy', vm);

      //
      // data
      //

      // const {dataSource: dataSourceRef} = toRefs(props); // toRef 改变原始对象, 但不会UI更新
      const dataSourceRef = ref(props.dataSource);
      vm.dataSourceRef = dataSourceRef;
      // console.log(TAG, 'dataSourceRef', dataSourceRef);
      // 校验结果存储 a/b/c -> true|false
      const validateResult = reactive({});

      //
      // methods
      //

      const isValid = () => {
        /*// 没有孩子时, 值肯定有效
        if (this.dataSource.children && this.dataSource.children.length > 0) {
          return this.valueValid;
        }
        return this.valueValid == true;*/

        // console.log("childNc", this.$refs.childNc)
        let selfValidate = !Object.values(vm.validateResult).some(e => e == false)
        let childrenValidate = true
        if (vm.$refs.childNc && vm.$refs.childNc.length > 0) {
          childrenValidate = !vm.$refs.childNc.some(nc => !nc.IsValid())
        }

        return selfValidate && childrenValidate
      }

      // const isGroup = (crite) => {
      //   // return crite.hasOwnProperty("children");
      //   return crite.join != null;
      // }

      const genVid = (pvid) => {
        // 要求: 必需要有 vid
        // pvid == null ? pvid = "" : pvid;
        // return pvid + ID_PATH_SEP + nextId()
        // 层级会变化, 就不用路由key格式了
        return nextId()
      }

      const getDefaultCriterion = (pvid) => {
        let first = vm.criterionOptions[0] || {};
        // 生成条件视图id
        let vid = vm.genVid(pvid)
        let defCrite = Object.assign({}, first)
        defCrite[VID] = vid
        defCrite.operator = first.fieldType && vm.operatorOptions[first.fieldType + ''][0].value
        defCrite.value = undefined

        return defCrite
      }

      /**
       * 设置默认值: 根据类型操作, 类型设置对应的默认值
       */
      const setDefaultValue = (crite) => {
        // 选择时, 默认第一项
        if (vm.isSelectVal(crite)) {
          crite.value = crite.options && crite.options[0] && crite.options[0].value
          return
        }

        let isBetween = crite.operator == OperatorEnum.between

        switch (crite.fieldType) {
          case FieldType.Bool:
            crite.value = 'true'; // 用 bool 貌似不行, 有警告
            break;
          case FieldType.Number:
            crite.value = isBetween ? '0,0' : 0;
            break;
          case FieldType.String:
            crite.value = isBetween ? ',' : '';
            break;
          // case FieldType.Array:
          //   crite.value = [];
          //   break;
          default:
            crite.value = undefined;
        }
      }

      Object.assign(vm, {isValid, isGroup, genVid, getDefaultCriterion, setDefaultValue});

      return {
        dataSourceRef,
        validateResult,
        ...useCrudCriterion(vm, ctx),
        isGroup,
      }
    },
    methods: {

      // ---- public begin ----
      GetRule() {
        return this.dataSource;
      },
      IsValid() {
        return this.isValid()
      },
      // 是否有有用的条件, id,operator,value 都不为空
      HasEffectCriterion() {
        let flag = false;
        if (this.isGroup(this.dataSource)) {
          flag = this.dataSource.children.some(e => !isEmpty(e.id) && !isEmpty(e.operator) && !isEmpty(e.value)); // 子元素如果是组则自动不满足, 下面 refs 调用则会判断到组
        } else {
          flag = !isEmpty(this.dataSource.id) && !isEmpty(this.dataSource.operator) && !isEmpty(this.dataSource.value);
        }

        if (!flag) { // 自己没有有用的, 才进一步看子节点
          if (this.$refs.childNc && this.$refs.childNc.length > 0) {
            flag = this.$refs.childNc.some(nc => nc.HasEffectCriterion())
          }
        }

        return flag;
      },
      // ---- public end ----

      // // 清洗规则配置数据
      // // 删除 id==null
      // cleanRule() {
      //   if (this.dataSource.children && this.dataSource.children.length > 0) {
      //     this.dataSource.children.foreach(e=>{
      //
      //     })
      //   }
      // },
      // ----

      // isValid() {
      //   /*// 没有孩子时, 值肯定有效
      //   if (this.dataSource.children && this.dataSource.children.length > 0) {
      //     return this.valueValid;
      //   }
      //   return this.valueValid == true;*/
      //
      //   // console.log("childNc", this.$refs.childNc)
      //   let selfValidate = !Object.values(this.validateResult).some(e => e == false)
      //   let childrenValidate = true
      //   if (this.$refs.childNc && this.$refs.childNc.length > 0) {
      //     childrenValidate = !this.$refs.childNc.some(nc => !nc.IsValid())
      //   }
      //
      //   return selfValidate && childrenValidate
      // },

      isSelectVal,
      // to do 可以点选, 可以插入
      // @mouseover="overCriterionItem(crite, $event)"
      // @mouseout="outCriterionItem(crite, $event)"
      // overCriterionItem(crite, $event) {
      //   console.log('enterCriterionItem....', crite, $event)
      //   // $event.target.classList.toggle('enter');
      //   $event.target.classList.add('class', 'focus');
      // },
      // outCriterionItem(crite, $event) {
      //   console.log('focusCriterionItem');
      //   $event.target.classList.remove('class', 'focus');
      // },

      // multiValueChange(value) {
      //   console.log(value);
      // },
      getInputTip,
      // 强制刷新一些组件
      forceRefresh() {
        this.forceFlag = false
        this.$nextTick(() => {
          this.forceFlag = true
        })
      },
      isRoot() {
        // let b = this.dataSource.id == null || this.dataSource.id == ROOT;
        let b = this.dataSource.id == ROOT;
        // console.log(TAG, 'isRoot', b);
        return b;
      },
      // genVid(pvid) {
      //   // 要求: 必需要有 vid
      //   // pvid == null ? pvid = "" : pvid;
      //   // return pvid + ID_PATH_SEP + nextId()
      //   // 层级会变化, 就不用路由key格式了
      //   return nextId()
      // },

      // /**
      //  * 新增组时,
      //  * 1) 前面已有的条件归并到一个组里
      //  * 2) 新增组默认显示一条待配置条件行
      //  * */
      // appendGroup(g) {
      //   console.log(TAG, 'appendGroup', g);
      //   if (!this.isValid()) {
      //     return;
      //   }
      //   let ngIx = g.children.length; // 新增组的索引
      //   // 如果第一个元素不是组, 说明是第一次新增组, 要归并
      //   if (g.children && g.children.length > 0 && !this.isGroup(g.children[0])) {
      //     let tmp = {
      //       // id: g.id + '.' + 1,
      //       // id: this.getGroupId(0),
      //       // name: '组 ' + (g.id + '.' + 1),
      //       [VID]: this.genVid(g[VID]),
      //       join: g.join, // 继承父的 join 类别
      //       children: [].concat(g.children)
      //     };
      //     g.children.splice(0); // 得用它清除, 这样才能响应式
      //     g.children.push(tmp);
      //     ngIx = 1;
      //   }
      //
      //   // 增加新组
      //   g.children.push({
      //     // id: g.id + '.' + ngId,
      //     // id: this.getGroupId(ngIx),
      //     // name: '组 ' + (g.id + '.' + ngId),
      //     [VID]: this.genVid(g[VID]),
      //     join: AND, // 默认 and
      //     children: [
      //       // 默认填充一个待配置条件
      //       this.getDefaultCriterion(g[VID]),
      //     ]
      //
      //   })
      //
      //   // 强行展开
      //   this.dataSource.fold = false;
      // },

      // /**点击条件时, 在其后追加一个并列条件*/
      // appendCriterion() {
      //   if (!this.isValid()) {
      //     return;
      //   }
      //   let defCrite = this.getDefaultCriterion(this.dataSource[VID]);
      //   this.setDefaultValue(defCrite);
      //   this.dataSource.children.push(defCrite);
      //
      //   // 强行展开
      //   this.dataSource.fold = false
      // },

      // deleteCriterion(i) {
      //   this.delete(i);
      // },

      // deleteGroup(i) {
      //   this.delete(i);
      //   // ~~删除组后,  children id 重置~~
      //   // this.dataSource.children && this.dataSource.children.forEach((e, k) => {
      //   //   // if (this.isGroup(e)) { // let id = this.groupId ? this.groupId + '.' + (k + 1) : ""+(k + 1);
      //   //   //   let id = this.getGroupId(i);
      //   //   //   e.id = id;
      //   //   //   // e.name = '组 ' + id;
      //   //   // }
      //   //
      //   // })
      //
      //   // 删除组后, 组内递归清除相关校验结果
      //   recursiveExec(this.dataSource.children, (item) => {
      //     delete this.validateResult[item[VID]]
      //   })
      //
      // },

      // delete(i) {
      //   let del = this.dataSource.children.splice(i, 1)[0];
      //   // 清除相关的校验结果
      //   delete this.validateResult[del[VID]]
      //   // 没有子集时, 自身要自杀, 根级没有父级帮他自杀, 所以根级自动可以没有儿子
      //   if (this.dataSource.children.length == 0) {
      //     this.$emit('delete');
      //   }
      // },

      onChildrenCleared(i) {
        this.deleteGroup(i);
      },

      // changeJoin() {
      //   this.dataSource.join = this.dataSource.join == AND ? OR : AND;
      //   // this.$emit('update:join', this.ijoin);
      //   this.$forceUpdate();
      // },

      getGroupLevel(gid) {
        // if (gid == null || gid == ROOT) {
        //   return 0;
        // }
        // return gid.split('.').length;
        return this.level || 0
      },

      getOperatorOptions(crite) {
        // 特殊处理: ValType 是布尔时, 相当于 FieldType 是布尔
        if (crite.valType == ValType.Bool) {
          return operatorOptions[FieldType.Bool + ''];
        }

        return operatorOptions[crite.fieldType + ''];
      },

      // 是否显示和条件组相关的视图
      isRenderGroupElement(crite) {
        return crite.children && crite.children.length > 1;
      },
      // isGroup(crite) {
      //   // return crite.hasOwnProperty("children");
      //   return crite.join != null;
      // },
      isShow(crite) {
        if (crite.fold === undefined) {
          // this.groupIdSet[crite.id] = true; // 不能被追踪, 不是响应式的
          // this.$set(this.groupIdSet, crite.id, true);
          // this.$set(crite, 'fold', false); // 默认展开
          crite.fold = false;
        }
        // return this.groupIdSet[crite.id];
        return !crite.fold;
      },
      getGroupName(crite) {
        // 没有 name , 则使用默认名称, 规则: '组 '+gid
        if (crite.title == ROOT) {
          return '';
        }

        if (crite.title) {
          return crite.title;
        }

        // return '组 ' + crite.id;
        return this.seq ? '组 ' + this.seq : '';
      },

      getGroupId(k) {
        return this.isRoot() ? (k + 1) + '' : this.dataSource.id + '.' + (k + 1);
      },

      isOneSideOpt(opt) {
        return opt == OperatorEnum.isNull || opt == OperatorEnum.notNull;
      },
      handleCriteIdChange(crite) {
        let criterion = this.criterionOptionsMap[crite.id];
        crite.title = criterion.title;
        crite.fieldType = criterion.fieldType;
        crite.operator = this.operatorOptions[criterion.fieldType + ''][0].value; // 取0位作为预选操作符
        crite.valType = criterion.valType;
        crite.options = criterion.options || (crite.valType == ValType.Bool && BoolOptions);
        crite.remark = criterion.remark;
        // id 变了, 关联的校验结果清除
        delete this.validateResult[crite[VID]]
        crite[VALIDATE_MSG] = ""

        // 根据 fieldType 赋默认值
        this.setDefaultValue(crite);
        // // 貌似 值选项 会出现不更新的情况, 为了触发 ValueInputSelect 组件更新
        // let v = crite.value
        // crite.value = null
        // this.$nextTick(() => {
        //   crite.value = v
        // })
        // this.$forceUpdate()
        // this.forceRefresh()

        this.$emit(EMITS.CHANGE, this.dataSource, 'id')
      },
      onOperatorChange(val) {
        this.$emit(EMITS.CHANGE, this.dataSource, 'operator')
      },
      onValueChange(val, eventType) {
        // console.log(TAG, "onValueChange::", val, eventType);
        this.$emit(EMITS.UPDATE_VALUE, val);
        this.$emit(EMITS.CHANGE, this.dataSource, eventType);
      },

      // validateValue(crite, e) {
      //   // console.log('validateValue::', crite, e);
      //   let isMulti = crite.operator == OperatorEnum.in;
      //   let isOk = true;
      //   let tip = '';
      //   let val = crite.value;
      //   switch (crite.fieldType) {
      //     case FieldType.Bool:
      //       // isOk = isMulti ? MultiBoolReg.test(val) : BoolReg.test(val);
      //       if (isMulti) {
      //         isOk = MultiBoolReg.test(val);
      //         if (!isOk) tip = '请输入如: true,false,...'
      //       } else {
      //         isOk = BoolReg.test(val);
      //         if (!isOk) tip = '请输入如: true 或 false'
      //       }
      //       break;
      //     case FieldType.Number:
      //       if (isMulti) {
      //         isOk = MultiNumberReg.test(val);
      //         if (!isOk) tip = '请输入如: 123,456,...'
      //       } else {
      //         isOk = NumberReg.test(val);
      //         if (!isOk) tip = '请输入如: 123'
      //       }
      //       break;
      //     case FieldType.String:
      //       // 随意
      //       break;
      //     // case FieldType.Array:
      //     //   break;
      //     // default:
      //   }
      //
      //   this.valueValid = isOk;
      //
      //   // this.$set(crite, VALIDATE_MSG, tip);
      //   crite[VALIDATE_MSG] = tip;
      // },
      // setDefaultValue(crite) {
      //   // 选择时, 默认第一项
      //   if (this.isSelectVal(crite)) {
      //     crite.value = crite.options && crite.options[0] && crite.options[0].value
      //     return
      //   }
      //
      //   let isBetween = crite.operator == OperatorEnum.between
      //
      //   switch (crite.fieldType) {
      //     case FieldType.Bool:
      //       crite.value = 'true'; // 用 bool 貌似不行, 有警告
      //       break;
      //     case FieldType.Number:
      //       crite.value = isBetween ? '0,0' : 0;
      //       break;
      //     case FieldType.String:
      //       crite.value = isBetween ? ',' : '';
      //       break;
      //     // case FieldType.Array:
      //     //   crite.value = [];
      //     //   break;
      //     default:
      //       crite.value = undefined;
      //   }
      // },
      // handleOperatorChange(crite) {
      //   if (crite == 'in') {
      //     crite.value = [];
      //   }
      // },


      // getFieldTypeById(cid) {
      //   let c = this.criterionOptions.filter(e => e.id == cid);
      //   if (c != null) {
      //     return c[0].fieldType;
      //   }
      //
      //   return null;
      // },

      // getDefaultCriterion(pvid) {
      //   let first = this.criterionOptions[0] || {};
      //   // 生成条件视图id
      //   let vid = this.genVid(pvid)
      //   let defCrite = Object.assign({}, first)
      //   defCrite[VID] = vid
      //   defCrite.operator = first.fieldType && this.operatorOptions[first.fieldType + ''][0].value
      //   defCrite.value = undefined
      //
      //   return defCrite
      // },

      criterionOptions2Map() {
        let map = {};
        this.criterionOptions.forEach(e => {
          map[e.id] = e;
        });

        return map;
      },
      onInputValidated(isValid, crite, validateResult) {
        // console.log(TAG, 'onInputValidated', isValid, crite, validateResult)
        // this.validateResult[this.dataSource.id + ID_PATH_SEP + crite.id] = isValid
        // 先合并进来子的
        // Object.assign(this.validateResult, validateResult)
        this.validateResult[crite[VID]] = isValid
        // 继续上报, 让父感知
        this.$emit(EMITS.VALIDATED, isValid, crite)
        this.$forceUpdate()
      },
      onChildGroupValidated(isValid, crite, validateResult) {
        // console.log(TAG, 'onChildGroupValidated', isValid, crite)
        // 先合并进来子的
        // Object.assign(this.validateResult, validateResult)
        this.validateResult[crite[VID]] = isValid
        // 继续上报, 让父感知
        this.$emit(EMITS.VALIDATED, isValid, crite)
        this.$forceUpdate()
      },
      onChildChange(e, eventType) {
        // console.log(TAG, 'onChildChange', e, eventType);
        this.$emit(EMITS.CHANGE, this.dataSource, eventType)
      },
      // 父给子安排一个编号
      getSeq(idx) {
        let s = (idx + 1) + '';
        return this.seq == null ? s : this.seq + '.' + s;
      },
      filterOption(input, option) {
        input = input.trim()
        let optionData = option.data.attrs.data;
        return optionData.id.indexOf(input) > -1 || optionData.title.indexOf(input) > -1
      }

    },
  })

</script>
