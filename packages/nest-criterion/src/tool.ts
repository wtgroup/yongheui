import {AND, OR, OperatorEnum, FieldType} from "./consts";
import {COMMA_RE} from '@yongheui/utils/constants';
import {isEmpty} from "@yongheui/utils/util";

export const recursiveExec = function (arr, exec) {
  if (arr && arr.length > 0) {
    arr.forEach((e, ix) => {
      exec && exec(e, ix)
      recursiveExec(e.children, exec)
    })
  }
}

export function isGroup(ruleNode) {
  return ruleNode && ruleNode.join && ruleNode.children;
}

/**
 * 解析规则为sql条件
 *
 * 本方法主要用于演示, 实践做法是将用户设置的规则json发送到后端, 由后端解析后, 查询数据库.
 */
export class RuleParser {

  static parseRule(rule) {
    let res = '';
    if (rule.children && rule.children.length > 0) {
      rule.children.forEach(child=>{
        let sql = null;
        if (isGroup(child)) {
          sql = RuleParser.parseRule(child);
        } else {
          sql = RuleParser.parseCriterion(child);
        }
        if (sql) {
          if (res.length > 0) {
            res += ' ' + rule.join + ' ';
          }
          res += sql;
        }
      })
    }

    return res? '(' + res + ')' : null;
  }

  static parseCriterion(ruleNode) {
    // 忽略 id, value 空的节点
    if (isEmpty(ruleNode.id) || isEmpty(ruleNode.value)) {
      return null;
    }

    const {fieldType, operator, value} = ruleNode;

    let emptyWhere = null;
    if (operator == OperatorEnum.isNull) {
      emptyWhere = `${ruleNode.id} is null`;
      if (fieldType == FieldType.String) {
        emptyWhere += ` ${OR} ${ruleNode.id} = ''`;
      }
      return emptyWhere;
    }
    if (operator == OperatorEnum.notNull) {
      emptyWhere = `${ruleNode.id} is not null`;
      if (fieldType == FieldType.String) {
        emptyWhere += ` ${AND} ${ruleNode.id} != ''`;
      }
      return emptyWhere;
    }

    return RuleParser.parseCriterion0(ruleNode.id, operator, fieldType, value);
  }

  static parseCriterion0(id, operator, fieldType, value) {
    if (fieldType === FieldType.String) {
      return RuleParser.parseString(id, operator, value);
    } else if (fieldType === FieldType.Number) {
      return RuleParser.parseNumber(id, operator, value);
    } else if (fieldType === FieldType.Bool) {
      return RuleParser.parseBool(id, operator, value);
    } else if (FieldType.isArray(fieldType)) {
      return RuleParser.parseArray(id, operator, value, fieldType);
    }

    return null;
  }

  static parseString(id, operator, value) {
    if (operator == OperatorEnum.in) {
      return RuleParser.parseIn(id, value, FieldType.String);
    }
    if(operator == OperatorEnum.between) {
      return RuleParser.parseBetween(id, value, FieldType.String);
    }

    // '' 包裹
    let strVal = RuleParser.packBySiQuotes(value.toString());

    switch (operator) {
      case OperatorEnum.eq:
        return id + " = " + strVal;
      case OperatorEnum.nq:
        return id + " != " + strVal;
      case OperatorEnum.gt:
        return id + " > " + strVal;
      case OperatorEnum.ge:
        return id + " >= " + strVal;
      case OperatorEnum.lt:
        return id + " < " + strVal;
      case OperatorEnum.le:
        return id + " <= " + strVal;
      case OperatorEnum.has:
        return RuleParser.parseHas(id, value, FieldType.String);
      case OperatorEnum.hasnt:
        return RuleParser.parseHasnt(id, value, FieldType.String);
    }

    return null;
  }

  static parseNumber(id, operator, value) {
    if (operator == OperatorEnum.in) {
      return RuleParser.parseIn(id, value, FieldType.Number);
    }
    if(operator == OperatorEnum.between) {
      return RuleParser.parseBetween(id, value, FieldType.Number);
    }

    // 不包裹
    let strVal = value.toString();

    switch (operator) {
      case OperatorEnum.eq:
        return id + " = " + strVal;
      case OperatorEnum.nq:
        return id + " != " + strVal;
      case OperatorEnum.gt:
        return id + " > " + strVal;
      case OperatorEnum.ge:
        return id + " >= " + strVal;
      case OperatorEnum.lt:
        return id + " < " + strVal;
      case OperatorEnum.le:
        return id + " <= " + strVal;
      case OperatorEnum.has:
      case OperatorEnum.hasnt:
        console.error("Number 不支持的操作类型: " + operator);
    }

    return null;
  }

  static parseBool(id, operator, value) {
    if (operator == OperatorEnum.in) {
      return RuleParser.parseIn(id, value, FieldType.Bool);
    }
    if(operator == OperatorEnum.between) {
      return RuleParser.parseBetween(id, value, FieldType.Bool);
    }

    // 不包裹
    let strVal = value.toString();

    switch (operator) {
      case OperatorEnum.eq:
        return id + " = " + strVal;
      case OperatorEnum.nq:
        return id + " != " + strVal;
      case OperatorEnum.gt:
        return id + " > " + strVal;
      case OperatorEnum.ge:
        return id + " >= " + strVal;
      case OperatorEnum.lt:
        return id + " < " + strVal;
      case OperatorEnum.le:
        return id + " <= " + strVal;
      case OperatorEnum.has:
      case OperatorEnum.hasnt:
        console.error("Bool 不支持的操作类型: " + operator);
    }

    return null;
  }

  static parseArray(id, operator, value, fieldType) {
    switch (operator) {
      case OperatorEnum.eq:
      // return id + " = " + strVal;
      case OperatorEnum.nq:
      // return id + " != " + strVal;
      case OperatorEnum.gt:
      // return id + " > " + strVal;
      case OperatorEnum.ge:
      // return id + " >= " + strVal;
      case OperatorEnum.lt:
      // return id + " < " + strVal;
      case OperatorEnum.le:
      case OperatorEnum.in:
      case OperatorEnum.between:
        // return id + " <= " + strVal;
        console.log("Array 不支持的操作类型: " + operator);
      // 理论上 has, hasnt 不会出现在数组这里, 这里为了防御
      case OperatorEnum.has:
      case OperatorEnum.hasAny:
        return RuleParser.parseHasAny(id, value, fieldType);
      case OperatorEnum.hasnt:
      case OperatorEnum.notHasAny:
        return RuleParser.parseNotHasAny(id, value, fieldType);
      case OperatorEnum.hasAll:
        return RuleParser.parseHasAll(id, value, fieldType);
    }

    return null;
  }

  static parseIn(id, value, fieldType) {
    let split = value.split(COMMA_RE);
    if (split.length == 0) {
      return null;
    }
    let sb = '';
    sb += "in (";
    for (let s of split) {
      s = fieldType == FieldType.String ? RuleParser.packBySiQuotes(s) : s;
      sb += s + ',';
    }
    sb = sb.substr(0, sb.length - 1);
    sb += ")";

    return id + ' ' + sb;
  }

  static parseBetween(id, value, fieldType) {
    // value ',' 切割成左右两个值
    let split = value.split(COMMA_RE);
    if (split.length != 2) {
      console.error("`between` 要求起止两个值, "+ id + ", " + value);
      return null;
    }
    let start = split[0];
    let end = split[1];
    if (isEmpty(start)) {
      console.error("`between` 开始值为空, " + id + ", " + value);
      return null;
    }
    if (isEmpty(end)) {
      console.error("`between` 结束值为空, " + id + ", " + value);
      return null;
    }
    start = fieldType == FieldType.String ? RuleParser.packBySiQuotes(start) : start;
    end = fieldType == FieldType.String ? RuleParser.packBySiQuotes(end) : end;

    return id + " >= " + start + " and " + id + " <= " + end;
  }

  static parseHasnt(id, value, fieldType) {
    return id + " not like " + "'%" + value + "%'";
  }

  static parseHas(id, value, fieldType) {
    return id + " LIKE " + "'%" + value + "%'";
  }

  static parseHasAny(id, value, fieldType) {
    if (FieldType.isArray(fieldType)) {
      return RuleParser.parseArrayHasesSqlSegment("hasAny", id, value, fieldType);
    } else {
      console.error("`hasAny` 不匹配类型 " + fieldType);
    }
  }

  static parseNotHasAny(id, value, fieldType) {
    if (FieldType.isArray(fieldType)) {
      return RuleParser.parseArrayHasesSqlSegment("not hasAny", id, value, fieldType);
    } else {
      console.error("`not hasAny` 不匹配类型 " + fieldType);
    }
  }

  static parseHasAll(id, value, fieldType) {
    if (FieldType.isArray(fieldType)) {
      return RuleParser.parseArrayHasesSqlSegment("hasAll", id, value, fieldType);
    } else {
      console.error("`hasAll` 不匹配类型 " + fieldType);
    }
  }

  static parseArrayHasesSqlSegment(hasFuncName, id, value, fieldType) {
    let subArr = value.split(COMMA_RE);
    let subArrStr = null;
    switch (fieldType) {
      case FieldType.ArrayString:
        // Array<String>, 每个元素用单引号包起来
        subArrStr = RuleParser.processArrString(subArr, "[", "]", "'");
        break;
      default:
        subArrStr = RuleParser.processArrString(subArr, "[", "]", null);
    }

    if (subArrStr != null) {
      return `${hasFuncName}(${id}, ${subArrStr})`
    } else {
      return null;
    }
  }

  static processArrString(arr, startWrap, endWrap, eleWrap) {
    let sb = '';
    if (!arr) {
      return null;
    }
    sb += startWrap;
    for (let s of arr) {
      if (eleWrap) {
        sb += eleWrap + s + eleWrap;
      } else {
        sb += s;
      }
      sb += ',';
    }

    sb = sb.substr(0, sb.length - 1);
    sb += endWrap;

    return sb;
  }

  static packBySiQuotes(s) {
    return "'" + s + "'";
  }

}


