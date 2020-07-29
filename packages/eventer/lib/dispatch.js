const { DETAIL_WRAPPER } = require('./detail');
const { TARGETS } = require('./constants');

function dispatch(type, func, _target) {
  if (Array.isArray(func)) {
    func.forEach((v) => dispatch(type, v, _target));
    return;
  }

  if (typeof func === 'object') {
    const isTouch = DETAIL_WRAPPER.detail.device === 'touch';
    const which = isTouch ? 1 : DETAIL_WRAPPER.detail.srcEvent.which || 0;
    if (which && func[which]) dispatch(type, func[which], _target);
    if (func[0]) dispatch(type, func[0], _target);
    return;
  }

  const target = _target || DETAIL_WRAPPER.detail.target;
  !!func({ ...DETAIL_WRAPPER.detail, type, target });
}

let targetLast;
function preDispatch(type, target) {
  let el = target;
  if (el === document.body.parentElement && targetLast) el = targetLast;
  targetLast = el;
  const isTouch = DETAIL_WRAPPER.detail.device === 'touch';
  const which = isTouch ? 1 : DETAIL_WRAPPER.detail.srcEvent.which || 0;
  let issetEvent = false;
  while (el) {
    if (DETAIL_WRAPPER.detail.stopped) return;
    const self = TARGETS.get(el);
    if (self && self[type] && (self[type][0] || self[type][which])) {
      if (!issetEvent) {
        (issetEvent = true), DETAIL_WRAPPER.detail.srcEvent.preventDefault();
      }
      dispatch(type, self[type], el);
    }
    el = el.parentElement;
  }
}

module.exports = { dispatch, preDispatch };
