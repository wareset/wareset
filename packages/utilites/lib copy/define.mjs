import { isObj } from './base';

export default object => (key, props, writable) => {
  if (!isObj(props)) props = { value: props };
  props = {
    enumerable: false,
    configurable: true,
    writable: true,
    ...props
  };
  if (props.get || props.set) delete props.writable;
  else if (writable !== undefined) props.writable = !!writable;
  Object.defineProperty(object, key, props);
};
