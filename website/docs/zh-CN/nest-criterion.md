## YNestCriterion 嵌套条件设计器



提供友好便捷的SQL条件可视化设置.

1. 降低使用门槛，不懂sql的业务人员可以随心所欲的关注业务逻辑，轻松设置用户人群包圈人条件.
2. 提高便捷性，对于精通sql的技术人员，这仍然是个很好用的组件，用于界面sql.



**使用场景**

1. 用户人群包圈定：后端实现准备好用户画像大宽表. 页面中使用此组件手动配置sql条件（圈人规则），发送后端解析成可执行sql，执行查询，圈定人群包.
2. 其他需要界面设置sql的场景：本组件可以很好的助力界面配置`where`和`having`部分.



**概念**

- `条件`：一个条件表达式就是一个`条件`. 如：`is_student = 'Y'`.
- `条件组`：`and` 或 `or` 连接的同层级的多个条件构成`条件组` .
- `操作符`(*operator*): `>`, `=`, `<` ...
- `字段类型`(*FieldType*): 对应数据库表字段的实际类型. 如 `String`,`Number`.
- `值类型`(*ValType*): 字段值类型由具体业务含义决定, 和实际类型无关. 如`是否学生`, 实际中一般用 *1:是, 0:否* 表达. 那么, 其`FieldType`是`Number`, 但`ValType`是`布尔`.

每个条件组默认会有一个条件, 没有条件的条件组自动 `删除` , 不允许没有条件的 条件组存在.
组标题行后的 `新增` 条件组 新增下一级组.
`新增` 都是新增 兄弟. 条件后新增增加兄弟条件; 组后新增新增兄弟组.


**使用指导**

实践中, 需要关注一个重要的参数: `criterionOptions`. 此参数主要和需要查询的大宽表元数据信息对应(列名, 列类型等).
这些信息需要对应的配置表描述.

元信息字段:

| 字段名 | 含义 | 必填? | 备注 |
| ------| -----| ----- | ----|
| id    | 字段名 | Y |  |
| title | 字段友好名称 | N |  |
| fieldType | 字段类型 | Y |  |
| fieldType_dictText | 字段类型解释 | N |  |
| valType | 字段值类型 | Y | 实际业务决定. 连续值; 布尔值; 离散值(枚举值). 如, '是否学生' 认为是'布尔'类型, '订单状态' 认为是 '离散' 类型. 值类型会影响可选的条件表达式`操作符`范围 |
| valType_dictText | 字段值类型解释 | N | |
| remark | 备注 | N | 额外说明 |
| options | 布尔/离散 值类型 时, 会有提供下拉选择的选项集. | N |  |


### 基本使用


:::demo
```html
<template>
  <div>
    <y-nest-criterion ref="nc" :criterionOptions="criterionOptions" @change="changeEvent"></y-nest-criterion>
  </div>
</template>

<script>

// import {RuleParser} from '@yongheui/nest-criterion/src/tool'; // todo 'import' and 'export' may only appear at the top level

export default {
  data() {
    return {
      // 实践中, 此选项由后端配置表查询封装返回
      criterionOptions: [{
        "id": "is_student",
        "title": "是否学生",
        "fieldType": 2,
        "fieldType_dictText": "String",
        "valType": 2,
        "valType_dictText": "Bool",
        "remark": "1: 是; 0: 否",
        "options": [{
          "value": "1",
          "text": "是",
          "extra": null,
          "disabled": null
        }, {
          "value": "0",
          "text": "否",
          "extra": null,
          "disabled": null
        }]
      }, {
        "id": "age",
        "title": "年龄段",
        "fieldType": 2,
        "fieldType_dictText": "String",
        "valType": 3,
        "valType_dictText": "Scatter",
        "remark": "0: <=18; 1: (18,30]; 2: (30, 40]; 3: >40",
        "options": [{
          "value": "0",
          "text": "<=18",
          "extra": ""
        }, {
          "value": "1",
          "text": "(18,30]",
          "extra": ""
        }, {
          "value": "2",
          "text": "(30, 40]",
          "extra": ""
        }, {
          "value": "3",
          "text": ">40",
          "extra": ""
        }]
      }, {
        "id": "cate_id_list",
        "title": "类目id",
        "fieldType": 62,
        "fieldType_dictText": "ArrayString",
        "valType": 1,
        "valType_dictText": "Series",
        "remark": "",
        "options": null
      }, {
        "id": "avg_gmv_180",
        "title": "近半年平均gmv",
        "fieldType": 1,
        "fieldType_dictText": "Number",
        "valType": 1,
        "valType_dictText": "Series",
        "remark": "",
        "options": null
      }, {
        "id": "uid_consumption_level",
        "title": "uid_消费等级",
        "fieldType": 2,
        "fieldType_dictText": "String",
        "valType": 3,
        "valType_dictText": "Scatter",
        "remark": "区分低, 中低, 中高, 高四档(<Q1,[Q1,Q2),[Q2,Q3),Q3<=), 用户维度.",
        "options": [{
          "value": "H",
          "text": "高",
          "extra": "",
          "disabled": null
        }, {
          "value": "M+",
          "text": "中高",
          "extra": "",
          "disabled": null
        }, {
          "value": "M-",
          "text": "中低",
          "extra": "",
          "disabled": null
        }, {
          "value": "L",
          "text": "低",
          "extra": "",
          "disabled": null
        }]
      }]
    }
  },
  methods: {
    changeEvent(dataSource) {
      console.log(dataSource);
      let sql = RuleParser.parseRule(dataSource);
      console.log('changeEvent::parsed sql ==> ', sql);
    },
  }


}
</script>
```
:::



### API

#### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| width | 宽度 | number |  | 600 |
| maxDepth | 组的最大深度. level 从0起始, 所以默认最大嵌套4层 | number|string |  | 3 |
| dataSource | 初始的条件值. 类似 input | select 组件的 value . | object |  |  |
| criterionOptions | 条件选项集, 待从中选择, 最终生成 dataSource . | array |  |  |


#### Events
| 事件名称 | 说明 | 回调参数 |
|---------|---------|---------|
| change | `id`, `operator`, `value` 改变时; 条件(组)增删时 | dataSource |







