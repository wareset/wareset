const { getDevice } = require('./util');
const { createDetail } = require('./detail');

const hover_and_focus = require('./events/hover_and_focus');
const mouse_and_touch = require('./events/mouse_and_touch');

let device;
function callback(e) {
  if (!device) (device = getDevice(e)), setTimeout(() => (device = ''), 1000);
  if (device !== getDevice(e)) return;
  createDetail(e), hover_and_focus(e), mouse_and_touch(e);
}

let isListened;
function listen(is = true) {
  if (!!is === isListened || typeof window === 'undefined') return;
  isListened = !!is;

  const method = is ? document.addEventListener : document.removeEventListener;

  method('mousedown', callback, false);
  method('mousemove', callback, false);
  method('mouseup', callback, false);

  method('touchstart', callback, false);
  method('touchmove', callback, false);
  method('touchend', callback, false);
  method('touchcancel', callback, false);
}

module.exports = listen;
