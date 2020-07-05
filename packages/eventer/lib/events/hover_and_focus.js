const { dispatch } = require('../dispatch');
const { TARGETS } = require('../constants');
const { getType } = require('../util');

let _targetHover, _targetFocus;
const HOVERED = new Map();
const FOCUSED = new Map();

function update_HOVERED(e) {
  HOVERED.clear();

  let self;
  let el = e.target;
  while (el) {
    self = TARGETS.get(el);
    if (self) HOVERED.set(el, self);
    el = el.parentElement;
  }
}

function update_FOCUSED_AND_HOVERED(e) {
  HOVERED.clear();
  FOCUSED.clear();

  let self;
  let el = e.target;
  while (el) {
    self = TARGETS.get(el);
    if (self) HOVERED.set(el, self), FOCUSED.set(el, self);
    el = el.parentElement;
  }
}

export default function hover_and_focus(e) {
  if (_targetHover === e.target && _targetFocus === e.target) return;
  const type = getType(e);
  // const device = getDevice(e);
  if (type === 'pinch') return;

  _targetHover = e.target;
  if (type !== 'move' && type !== 'end') _targetFocus = e.target;

  // console.log('hover_and_focus', type, device, e.target);

  let old_FOCUSED;
  const old_HOVERED = new Map(HOVERED);
  if (type !== 'move' && type !== 'end') {
    old_FOCUSED = new Map(FOCUSED);
    update_FOCUSED_AND_HOVERED(e);
  } else update_HOVERED(e);

  let isStop;

  isStop = false;
  old_HOVERED.forEach((self, el) => {
    if (isStop || HOVERED.has(el)) return isStop;
    if (self['hover']) {
      isStop = dispatch('hover:out', self['hover'], el) || isStop;
    }
    if (self['hover:out']) {
      isStop = dispatch('hover:out', self['hover:out'], el) || isStop;
    }
    return isStop;
  });

  isStop = false;
  HOVERED.forEach((self, el) => {
    if (isStop || old_HOVERED.has(el)) return isStop;
    if (self['hover']) {
      isStop = dispatch('hover:in', self['hover'], el) || isStop;
    }
    if (self['hover:in']) {
      isStop = dispatch('hover:in', self['hover:in'], el) || isStop;
    }
    return isStop;
  });

  if (type === 'move' || type === 'end') return;

  isStop = false;
  old_FOCUSED.forEach((self, el) => {
    if (isStop || FOCUSED.has(el)) return isStop;
    if (self['focus']) {
      isStop = dispatch('focus:out', self['focus'], el) || isStop;
    }
    if (self['focus:out']) {
      isStop = dispatch('focus:out', self['focus:out'], el) || isStop;
    }
    return isStop;
  });

  isStop = false;
  FOCUSED.forEach((self, el) => {
    if (isStop || old_FOCUSED.has(el)) return isStop;
    if (self['focus']) {
      isStop = dispatch('focus:in', self['focus'], el) || isStop;
    }
    if (self['focus:in']) {
      isStop = dispatch('focus:in', self['focus:in'], el) || isStop;
    }
    return isStop;
  });
}
