const noop = () => {};
const isVoid = v => v === null || v === undefined;

const isStore = check_store => {
  try {
    return check_store._.isStore === isStore;
  } catch (err) {
    return false;
  }
};

const definer = Writable => (prop, _props, writable) => {
  const props = {
    enumerable: false,
    configurable: true,
    ..._props
  };
  if (writable !== undefined) props.writable = !!writable;
  Object.defineProperty(Writable, prop, props);
};

const inArr = (arr, v, k = 0) => arr.indexOf(v, k) !== -1;

const forIn = (obj, cb) => {
  Object.keys(obj).forEach(v => cb(obj[v], v, obj));
};

const isFunc = v => typeof v === 'function';

module.exports = {
  noop,
  isVoid,
  isStore,
  definer,
  inArr,
  forIn,
  isFunc
};
