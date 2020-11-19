import deepEqual from '@wareset-utilites/deep-equal';
import { isVoid, isFunc, isObj } from 'wareset-utilites';

export default (a: any, b: any, deep: number | boolean | null): boolean => {
  if (isVoid(deep)) return false;
  if (typeof deep === 'boolean' || deep as number >= 0) {
    return deepEqual(a, b, deep as number);
  }
  return !(isFunc(a) || isObj(a) || !deepEqual(a, b, 0));
};
