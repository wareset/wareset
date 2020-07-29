const { dispatch } = require('../dispatch');
const { TARGETS } = require('../constants');
const { getType } = require('../util');

let _targetHover, _targetFocus;
let HOVERED = new Map();
let FOCUSED = new Map();

function hover_and_focus(e) {
  if (_targetHover === e.target && _targetFocus === e.target) return;
  const type = getType(e);
  // const device = getDevice(e);
  if (type === 'pinch') return;

  _targetHover = e.target;

  // console.log('hover_and_focus', type, device, e.target);

  let old_HOVERED, old_FOCUSED;
  (old_HOVERED = HOVERED), (HOVERED = new Map());
  let el;
  el = e.target;
  while (el) {
    if (TARGETS.has(el)) HOVERED.set(el, TARGETS.get(el));
    el = el.parentElement;
  }

  old_HOVERED.forEach((self, el) => {
    if (HOVERED.has(el)) return;
    if (self['hover']) dispatch('hover:out', self['hover'], el);
    if (self['hover:out']) dispatch('hover:out', self['hover:out'], el);
  });

  HOVERED.forEach((self, el) => {
    if (old_HOVERED.has(el)) return;
    if (self['hover']) dispatch('hover:in', self['hover'], el);
    if (self['hover:in']) dispatch('hover:in', self['hover:in'], el);
  });

  if (type === 'move' || type === 'end') return;
  _targetFocus = e.target;
  (old_FOCUSED = FOCUSED), (FOCUSED = HOVERED);

  old_FOCUSED.forEach((self, el) => {
    if (FOCUSED.has(el)) return;
    if (self['focus']) dispatch('focus:out', self['focus'], el);
    if (self['focus:out']) dispatch('focus:out', self['focus:out'], el);
  });

  FOCUSED.forEach((self, el) => {
    if (old_FOCUSED.has(el)) return;
    if (self['focus']) dispatch('focus:in', self['focus'], el);
    if (self['focus:in']) dispatch('focus:in', self['focus:in'], el);
  });
}

module.exports = hover_and_focus;
