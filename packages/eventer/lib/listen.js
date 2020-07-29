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

// function contextmenu(e) {
//   e.preventDefault();
//   console.log(e);
// }

let isListened;
function listen(is = true) {
  if (!!is === isListened || typeof window === 'undefined') return;
  isListened = !!is;

  const method = is ? document.addEventListener : document.removeEventListener;

  method('contextmenu', callback);

  method('mousedown', callback);
  method('mousemove', callback);
  method('mouseup', callback);

  method('touchstart', callback);
  method('touchmove', callback);
  method('touchend', callback);
  method('touchcancel', callback);
}

module.exports = listen;
