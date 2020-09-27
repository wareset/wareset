export * from './base';
export { default as each } from './each';
export { default as define } from './define';

export const noop = () => {};
export const inArr = (arr, v, k) => arr.indexOf(v, k || 0) !== -1;
export const forIn = (obj, cb) => {
  Object.keys(obj).forEach(k => cb(obj[k], k, obj));
};
