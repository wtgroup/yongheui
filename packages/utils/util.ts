import _ from "lodash";

export function hello(name: string) {
  console.log(`Hello, ${name}`);
}

/**
 * 将目标包装成 promise 返回
 * @param target function or 基本值 or promise
 * @param args
 */
export function wrapPromise(target, ...args) {
  let res
  if (_.isFunction(target)) {
    res = target(...args);
  } else {
    res = target
  }

  if (res instanceof Promise) {
    return res;
  } else {
    return Promise.resolve(res)
  }
}

/**
 * 非函数时, 直接返回; 函数时, 执行后返回结果
 * @param target
 * @param args
 */
export function pickValueAdapt(target, ...args) {
  if (_.isFunction(target)) {
    return target(...args);
  } else {
    return target
  }
}

/**
 * 判空
 *
 * null | undefined | ''
 * @param v
 */
export const isEmpty = function (v) {
  return v == null || (v + '').trim() === '';
};
