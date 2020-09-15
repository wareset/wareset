const { IS_STORE } = require('./consts.js');

const noop = () => {};
const isVoid = v => v === null || v === undefined;

const thisIsStore = check_store => {
  try {
    return check_store._[IS_STORE] === thisIsStore;
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

module.exports = {
  noop,
  isVoid,
  thisIsStore,
  definer,
  inArr,
  forIn
};
