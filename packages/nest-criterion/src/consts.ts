
import {CHANGE_EVENT, UPDATE_MODEL_EVENT, UPDATE_VALUE_EVENT} from '@yongheui/utils/constants'

export const TAG = "[YNestCriterion]";
export const ID_PATH_SEP = "/", COMMA = ",", VID = "__vid__", AND = "and", OR = "or",
  VALIDATE_MSG = "value__validateMsg", ROOT = "__root__";
export const EMITS = {
  DELETE: 'delete',
  CHANGE: CHANGE_EVENT,
  UPDATE_VALUE: UPDATE_VALUE_EVENT,
  UPDATE_MODEL: UPDATE_MODEL_EVENT,
  VALIDATED: 'validated',
}

// 所有操作符
export const OperatorEnum = {
  eq: 'eq',
  gt: 'gt',
  lt: 'lt',
  in: 'in',
  ge: 'ge',
  le: 'le',
  nq: 'nq',
  between: 'between',
  isNull: 'isNull',
  notNull: 'notNull',
  has: 'has',
  hasnt: 'hasnt',
  hasAny: 'hasAny',
  hasAll: 'hasAll',
  notHasAny: 'notHasAny',
}

// 条件值类型. 1:数值; 2:字符串; 3:布尔; 4:数组
export const FieldType = {
  Number: 1,
  String: 2,
  Bool: 3,
  ArrayNumber: 61,
  ArrayString: 62,
  ArrayBool: 63,
  isArray: (fieldTypeCode) => {
    return fieldTypeCode && fieldTypeCode >= 61 && fieldTypeCode <= 63
  }
}

// 字段值得分布类型: 1 连续, 2 布尔, 3 离散
export const ValType = {
  Series: 1,
  Bool: 2,
  Scatter: 3,
}

export const operatorOptions = {
  // 数字
  [FieldType.Number]: [
    {value: OperatorEnum.eq, text: '等于'},
    {value: OperatorEnum.gt, text: "大于"},
    {value: OperatorEnum.lt, text: "小于"},
    {value: OperatorEnum.in, text: "在"},
    {value: OperatorEnum.ge, text: "大于等于"},
    {value: OperatorEnum.le, text: "小于等于"},
    {value: OperatorEnum.nq, text: "不等于"},
    {value: OperatorEnum.between, text: "在...之间"},
    // {value: 'has', text: "包含"},
    // {value: 'hasnt', text: "不包含"},
    // 单侧操作符
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
  // 字符串
  [FieldType.String]: [
    {value: OperatorEnum.eq, text: '等于'},
    {value: OperatorEnum.gt, text: "大于"},
    {value: OperatorEnum.lt, text: "小于"},
    {value: OperatorEnum.in, text: "在"},
    {value: OperatorEnum.ge, text: "大于等于"},
    {value: OperatorEnum.le, text: "小于等于"},
    {value: OperatorEnum.nq, text: "不等于"},
    {value: OperatorEnum.between, text: "在...之间"},
    {value: OperatorEnum.has, text: "包含"},
    {value: OperatorEnum.hasnt, text: "不包含"},
    // 单侧操作符
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
  // 布尔
  [FieldType.Bool]: [
    {value: OperatorEnum.eq, text: '等于'},
    {value: OperatorEnum.nq, text: "不等于"},
    // {value: 'gt', text: "大于"},
    // {value: 'ge', text: "大于等于"},
    // {value: 'lt', text: "小于"},
    // {value: 'le', text: "小于等于"},
    // {value: 'has', text: "包含"},
    // {value: 'hasnt', text: "不包含"},
    // {value: OperatorEnum.in, text: "在"},
    // 单侧操作符
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
  // 数组
  [FieldType.ArrayNumber]: [
    // {value: 'eq', text: '等于'},
    // {value: 'nq', text: "不等于"},
    // {value: 'gt', text: "大于"},
    // {value: 'ge', text: "大于等于"},
    // {value: 'lt', text: "小于"},
    // {value: 'le', text: "小于等于"},
    {value: OperatorEnum.hasAny, text: "包含任一"},
    {value: OperatorEnum.hasAll, text: "包含所有"},
    {value: OperatorEnum.notHasAny, text: "全不包含"},
    // {value: 'in', text: "在"},
    // 单侧操作符
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
  [FieldType.ArrayString]: [
    {value: OperatorEnum.hasAny, text: "包含任一"},
    {value: OperatorEnum.hasAll, text: "包含所有"},
    {value: OperatorEnum.notHasAny, text: "全不包含"},
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
  [FieldType.ArrayBool]: [
    {value: OperatorEnum.hasAny, text: "包含任一"},
    {value: OperatorEnum.hasAll, text: "包含所有"},
    {value: OperatorEnum.notHasAny, text: "全不包含"},
    {value: OperatorEnum.isNull, text: "为空"},
    {value: OperatorEnum.notNull, text: "不为空"},
  ],
}

export const BoolOptions = [
  {value: 1, text: '是'},
  {value: 0, text: '否'},
]

export const NumberReg = /^([-+])?\d+(\.\d+)?$/;
// 多数字校验: 数字1,数字2,...
export const MultiNumberReg = /^(([-+])?\d+(\.\d+)?)(,([-+])?\d+(\.\d+)?)*$/;
export const BoolReg = /^(true|false)$/;
export const MultiBoolReg = /^(true|false)(,(true|false))*$/;
