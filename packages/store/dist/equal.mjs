import deepEqual from '@wareset/deep-equal';
import { isVoid, isFunc } from '@wareset/utilites';
export default ((a, b, deep) => {
  if (isVoid(deep)) return false;
  if (typeof deep === 'boolean' || deep >= 0) return deepEqual(a, b, deep);
  return !(isFunc(a) || !deepEqual(a, b, 0));
});