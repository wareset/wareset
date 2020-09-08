const { IS_STORE } = require('./consts.js');

const noop = () => {};
const isVoid = v => v === null || v === undefined;

const thisIsStore = check_store => {
  return Array.isArray(check_store) && check_store[IS_STORE] === thisIsStore;
};

const _define = Writable => (prop, _props, writable) => {
  const props = {
    enumerable: false,
    configurable: false,
    ..._props
  };
  if (writable !== undefined) props.writable = !!writable;
  Object.defineProperty(Writable, prop, props);
};

module.exports = {
  noop,
  isVoid,
  thisIsStore,
  _define
};
