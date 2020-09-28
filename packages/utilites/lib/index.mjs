export { isVoid, getProto, getCtor, has } from './base';
export { isArr, isObj, isNum, isStr, isBool, isFunc, isSymb } from './base';
export { default as each } from './each';
export { default as define } from './define';

export const noop = () => {};
export const inArr = (arr, v, k) => arr.indexOf(v, k || 0) !== -1;
export const forIn = (obj, cb) => {
  Object.keys(obj).forEach(k => cb(obj[k], k, obj));
};
