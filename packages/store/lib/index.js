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

const _define = Writable => (prop, _props, writable) => {
  const props = {
    enumerable: false,
    configurable: true,
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
