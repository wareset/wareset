const { DETAIL_WRAPPER } = require('./detail');
const { TARGETS } = require('./constants');

function dispatch(type, func, _target) {
  let isStop = false;
  if (Array.isArray(func)) {
    func.forEach((v) => {
      isStop = dispatch(type, v, _target) || isStop;
    });
    return isStop;
  }

  if (typeof func !== 'function') throw new Error();

  const target = _target || DETAIL_WRAPPER.detail.target;
  isStop = !!func({ ...DETAIL_WRAPPER.detail, type, target /*, _EVENTER*/ });

  return isStop;
}

let targetLast;
function preDispatch(type, target) {
  let self;
  let el = target;
  if (el === document.body.parentElement && targetLast) el = targetLast;
  targetLast = el;
  while (el) {
    self = TARGETS.get(el);
    if (self && self[type]) {
      if (dispatch(type, self[type], el)) return;
      // if (e && e.target === el) return;
    }
    el = el.parentElement;
  }
}

module.exports = { dispatch, preDispatch };
