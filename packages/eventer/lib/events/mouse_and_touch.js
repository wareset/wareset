const { DETAIL_WRAPPER } = require('../detail');
const { preDispatch } = require('../dispatch');
const { TARGETS } = require('../constants');
const { getType } = require('../util');

const OPTIONS = {
  delayTap: 250,
  delayPress: 500,
};

let pressTimeout;

let start_timeStamp = 0,
  end_timeStamp = 0,
  tap_timeStamp = 0;

let targetDrag, targetDragOld;

let IS_DRAGGING;
let _isDragging = 0;
const isDragging = (type) => {
  const D = DETAIL_WRAPPER.detail;
  if (type !== 'drag') _isDragging = 0;
  else {
    _isDragging += Math.sqrt(Math.pow(D.delta.x, 2) + Math.pow(D.delta.y, 2));
  }
  IS_DRAGGING = _isDragging >= D.pointSize;
  DETAIL_WRAPPER.detail.isDrag = IS_DRAGGING;
  return IS_DRAGGING;
};

function press(e) {
  preDispatch('press', e.target);
}

function tapDouble(e) {
  preDispatch('tap:double', e.target);
}

function tap(e) {
  if (IS_DRAGGING) return;
  if (e.timeStamp - tap_timeStamp < OPTIONS.delayTap) {
    tapDouble(e);
    // return;
  }
  tap_timeStamp = e.timeStamp;
  preDispatch('tap', e.target);
}

function start(e) {
  targetDrag = e.target;
  pressTimeout = setTimeout(() => press(e), OPTIONS.delayPress);
  start_timeStamp = e.timeStamp;
  // console.log('start');
  preDispatch('start', e.target);
}

function end(e) {
  // console.log('end', e, targetDrag);
  end_timeStamp = e.timeStamp;
  if (end_timeStamp - start_timeStamp < OPTIONS.delayTap) tap(e);

  if (targetDrag && targetDrag === targetDragOld) {
    DETAIL_WRAPPER.detail.isEnd = true;
    (targetDragOld = null), preDispatch('drag:end', targetDrag);
  }

  // console.log('end');
  preDispatch('end', e.target);
}

function move(e) {
  preDispatch('move', e.target);
}

function drag(e) {
  if (!targetDrag) targetDrag = e.target;
  if (targetDrag && targetDrag !== targetDragOld) {
    DETAIL_WRAPPER.detail.offset = { x: 0, y: 0 };
    DETAIL_WRAPPER.detail.isStart = true;
    (targetDragOld = targetDrag), preDispatch('drag:start', targetDrag);
  }

  DETAIL_WRAPPER.detail.isStart = false;
  DETAIL_WRAPPER.detail.isEnd = false;

  preDispatch('drag', targetDrag);
  if (DETAIL_WRAPPER.detail.deltaX) preDispatch('drag:x', targetDrag);
  if (DETAIL_WRAPPER.detail.deltaY) preDispatch('drag:y', targetDrag);
}

function pinch(e) {
  // console.log(e);
  preDispatch('pinch', e.target);
}

function contextmenu(e) {
  const is = (v) => v && (v[0] || v[3]);

  let el = e.target;
  while (el) {
    const self = TARGETS.get(el);
    if (
      self &&
      (is(self['start']) ||
        is(self['tap']) ||
        is(self['tap:double']) ||
        is(self['drag']) ||
        is(self['drag:start']))
    ) {
      e.preventDefault();
    }
    el = el.parentElement;
  }
}

const FUNCS = { start, end, move, drag, pinch };

function mouse_and_touch(e) {
  const type = getType(e);

  if (type === 'contextmenu') {
    contextmenu(e);
    return;
  }

  if (!(type === 'move' || type === 'drag') || IS_DRAGGING) {
    clearTimeout(pressTimeout);
  }

  if (e.shiftKey) {
    if (type === 'drag') return;
  }

  if (!e.ctrlKey && !e.shiftKey) {
    if (!(type === 'move' || type === 'end')) {
      try {
        if (TARGETS.has(e.target)) getSelection().removeAllRanges();
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (FUNCS[type]) FUNCS[type](e);
  isDragging(type);
}

module.exports = mouse_and_touch;
