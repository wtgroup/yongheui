import {getCurrentInstance} from 'vue';
import {TAG, VID, AND, EMITS, OR} from "./consts";
import {recursiveExec} from './tool';

export const useCrudCriterion = (vm, {emit}) => {
  console.log(TAG, 'useCrudCriterion vm', vm);

  const dataSourceValue = vm.dataSourceRef.value;
  const {isValid, isGroup, genVid, getDefaultCriterion, setDefaultValue} = vm;

  /**
   * 新增组时,
   * 1) 前面已有的条件归并到一个组里
   * 2) 新增组默认显示一条待配置条件行
   */
  const appendGroup = (g) => {
    console.log(TAG, 'appendGroup', g);
    if (!isValid()) {
      return;
    }
    let ngIx = g.children.length; // 新增组的索引
    // 如果第一个元素不是组, 说明是第一次新增组, 要归并
    if (g.children && g.children.length > 0 && !isGroup(g.children[0])) {
      let tmp = {
        // id: g.id + '.' + 1,
        // id: this.getGroupId(0),
        // name: '组 ' + (g.id + '.' + 1),
        [VID]: genVid(g[VID]),
        join: g.join, // 继承父的 join 类别
        children: [].concat(g.children)
      };
      g.children.splice(0); // 得用它清除, 这样才能响应式
      g.children.push(tmp);
      ngIx = 1;
    }

    // 增加新组
    g.children.push({
      // id: g.id + '.' + ngId,
      // id: this.getGroupId(ngIx),
      // name: '组 ' + (g.id + '.' + ngId),
      [VID]: genVid(g[VID]),
      join: AND, // 默认 and
      children: [
        // 默认填充一个待配置条件
        getDefaultCriterion(g[VID]),
      ]

    })

    // 强行展开
    dataSourceValue.fold = false;

    emit(EMITS.CHANGE, dataSourceValue);
  }

  const delete0 = (i) => {
    let del = dataSourceValue.children.splice(i, 1)[0];
    // 清除相关的校验结果
    delete vm.validateResult[del[VID]]
    // 没有子集时, 自身要自杀, 根级没有父级帮他自杀, 所以根级自动可以没有儿子
    if (dataSourceValue.children.length == 0) {
      emit(EMITS.DELETE);
    }

    emit(EMITS.CHANGE, dataSourceValue);
  }

  /**
   * 删除组
   */
  const deleteGroup = (i) => {
    delete0(i);
    // ~~删除组后,  children id 重置~~
    // this.dataSource.children && this.dataSource.children.forEach((e, k) => {
    //   // if (this.isGroup(e)) { // let id = this.groupId ? this.groupId + '.' + (k + 1) : ""+(k + 1);
    //   //   let id = this.getGroupId(i);
    //   //   e.id = id;
    //   //   // e.name = '组 ' + id;
    //   // }
    //
    // })

    // 删除组后, 组内递归清除相关校验结果
    recursiveExec(dataSourceValue.children, (item) => {
      delete vm.validateResult[item[VID]]
    })
  }

  /**点击条件时, 在其后追加一个并列条件*/
  const appendCriterion = () => {
    if (!isValid()) {
      return;
    }
    let defCrite = getDefaultCriterion(dataSourceValue[VID]);
    setDefaultValue(defCrite);
    dataSourceValue.children.push(defCrite);

    // 强行展开
    dataSourceValue.fold = false;

    emit(EMITS.CHANGE, dataSourceValue);
  }

  const deleteCriterion = (i) => {
    delete0(i);
  }


  const changeJoin = () => {
    dataSourceValue.join = dataSourceValue.join == AND ? OR : AND;
    // this.$emit('update:join', this.ijoin);
    // this.$forceUpdate();

    emit(EMITS.CHANGE, dataSourceValue);
  }


  return {
    appendGroup,
    deleteGroup,
    appendCriterion,
    deleteCriterion,
    changeJoin,
  }
}

