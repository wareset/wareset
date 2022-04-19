/* eslint-disable */
/*
dester builds:
__core__/utils.ts
__core__/keypad.ts
__core__/resize.ts
__core__/native.ts
__core__/cursor.ts
index.ts
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* filename: __core__/utils.ts
  timestamp: 2022-04-12T14:33:56.147Z */

var isBrowser = typeof window !== 'undefined';
var isPointers = isBrowser && 'onpointermove' in document;
var isArray = Array.isArray;

var noop = () => {};

var noopNoop = () => noop;

var preventDefault = e => {
  e.preventDefault();
};

var stopPropagation = e => {
  e.stopPropagation();
};

var addEvent = (target, type, listener, options) => {
  target.addEventListener(type, listener, options);
};

var delEvent = (target, type, listener) => {
  target.removeEventListener(type, listener);
};

var wmset = (weakmap, key, value) => (weakmap.set(key, value), value);

var REG = /^([a-z]+)|([.\d]+)|\(([^)]+)\)|\[([^\]]+)\]|(?<=\W)(\w+)/g; // eslint-disable-next-line @typescript-eslint/explicit-function-return-type

var getEventSettings = s => {
  var res = {
    type: '',
    num: 500,
    self: false,
    trusted: false,
    once: false,
    stop: false,
    prevent: false,
    passive: false,
    capture: false,
    x: false,
    y: false,
    u: false,
    d: false,
    l: false,
    r: false,
    xy: false,
    keys: {},
    kLen: 0
  };
  REG.lastIndex = 0;
  var matches, v;

  for (; matches = REG.exec(s);) {
    // event type
    if (v = matches[1]) res.type = v; // special for time events
    else if (v = matches[2]) res.num = +v * 1000; // KeyCodes

    if ((v = matches[3]) || (v = matches[4])) res.kLen++, res.keys[v] = 1; // other
    else if (v = matches[5]) (v in res || (v = v[0]) in res) && (res[v] = true);
  }

  res.xy = res.x || res.y || res.u || res.d || res.l || res.r;
  return res;
};

var wrap_base = fns => function (e) {
  for (var i = 0; i < fns.length; i++) {
    fns[i].call(this, e);
  }
};

var wrap_keys = (fn, es) => function (e) {
  pressedKeysIsEqual(es) && fn.call(this, e);
};

var wrap_self = fn => function (e) {
  e.target === this && fn.call(this, e);
};

var wrap_trusted = fn => function (e) {
  e.isTrusted && fn.call(this, e);
};

var pressedKeysIsEqual = es => {
  var n = es.kLen;

  for (var k in PRESSED_KEYS) {
    // @ts-ignore
    if (PRESSED_KEYS[k][0] in es.keys || PRESSED_KEYS[k][1] in es.keys) n--;else break;
  }

  return n <= 0;
};

var PRESSED_KEYS = {};
var KEYPAD_LISTENERS = [];

(() => {
  if (isBrowser) {
    var keysListen = () => {
      addEvent(document, 'keyup', e => {
        // @ts-ignore
        delete PRESSED_KEYS[e.code + e.key];
      }, false);
      addEvent(document, 'keydown', e => {
        // @ts-ignore
        PRESSED_KEYS[e.code + e.key] = [e.code, e.key]; // console.log([e.code, e.key], e)

        for (var i = 0; i < KEYPAD_LISTENERS.length; i++) {
          if (!KEYPAD_LISTENERS[i][0].kLen) KEYPAD_LISTENERS.splice(i--, 1);else if (KEYPAD_LISTENERS[i][0].type === 'test' || pressedKeysIsEqual(KEYPAD_LISTENERS[i][0])) KEYPAD_LISTENERS[i][1](e);
        }
      }, false);
    };

    keysListen();
  }
})();

var keypad = isBrowser ? (event, listeners) => {
  var unsub;

  if (!isArray(event)) {
    // @ts-ignore
    var fns = [].concat(listeners);
    var es = getEventSettings(event);
    if (!es.kLen) es.kLen = 1, es.type = 'test';

    unsub = () => {
      es.kLen = fns.length = 0;
    };

    var cb = wrap_base(fns);
    if (es.once) fns.push(unsub);
    if (es.stop) fns.unshift(stopPropagation);
    if (es.prevent) fns.unshift(preventDefault);
    if (es.trusted) cb = wrap_trusted(cb);
    KEYPAD_LISTENERS.push([es, cb]);
  } else {
    var unsubs = [];

    for (var i = 0; i < event.length; i++) {
      unsubs.push(keypad(event[i], listeners));
    }

    unsub = () => {
      for (; unsubs.length;) {
        unsubs.pop()();
      }
    };
  }

  return unsub;
} : noopNoop;

var resize = (() => {
  if (!isBrowser) return noopNoop;
  var WMR = new WeakMap();

  var getWH = e => 'offsetWidth' in e ? [e.offsetWidth, e.offsetHeight] : [e.clientWidth, e.clientHeight];

  var update = target => {
    var wsr = WMR.get(target);
    var [width, height] = getWH(target);

    if (wsr[2][0] !== width || wsr[2][1] !== height) {
      wsr[2][0] = width, wsr[2][1] = height;
      var rect = wsr[1] = target.getBoundingClientRect();
      width = rect.right - rect.left, height = rect.bottom - rect.top;

      for (var j = 0; j < wsr[0].length; j++) {
        for (var fns = wsr[0][j], l = 0; l < fns.length; l++) {
          fns[l]({
            target,
            width,
            height,
            top: rect.top,
            left: rect.left
          });

          if (!fns.length) {
            wsr[0].splice(j--, 1);
            wsr[0].length || (observer.unobserve(target), WMR.delete(target));
          }
        }
      }
    }
  };

  var observer;

  var listen = () => {
    listen = noop;

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(a => {
        for (var i = 0; i < a.length; i++) {
          update(a[i].target);
        }
      });
    } else {
      var E0 = [0];
      var timeoutid;
      var ELEMENTS = [];
      var __STO__ = setTimeout,
          __CTO__ = clearTimeout;

      var loop = () => {
        __CTO__(timeoutid);

        for (E0[0] = 0; E0[0] < ELEMENTS.length; E0[0]++) {
          update(ELEMENTS[E0[0]]);
        }

        if (ELEMENTS.length) timeoutid = __STO__(loop, 20);
      };

      document.addEventListener('visibilitychange', () => {
        document.hidden ? __CTO__(timeoutid) : loop();
      }, false);
      observer = {};

      observer.observe = target => {
        ELEMENTS.push(target), __STO__(loop, 20);
      };

      observer.unobserve = () => {
        ELEMENTS.splice(E0[0]--, 1);
      };
    }
  };

  return (target, listeners, autostart = true) => {
    listen();
    var fns = [].concat(listeners);
    var rect;
    var wser = WMR.get(target) || (observer.observe(target), wmset(WMR, target, [[], target.getBoundingClientRect(), getWH(target)]));
    wser[0].push(fns);

    if (autostart) {
      rect = wser[1];
      var width = rect.right - rect.left,
          height = rect.bottom - rect.top;

      for (var i = 0; i < fns.length; i++) {
        fns[i]({
          target,
          width,
          height,
          top: rect.top,
          left: rect.left
        });
      }
    }

    return () => {
      fns.length = 0;
    };
  };
})();

var native = isBrowser ? (target, event, listeners) => {
  var unsub;

  if (!isArray(event)) {
    // @ts-ignore
    var fns = [].concat(listeners);
    var es = getEventSettings(event);
    if (!es.type) throw event;

    unsub = () => {
      fns.length = 0, delEvent(target, es.type, cb);
    };

    var cb = wrap_base(fns);
    if (es.once) fns.push(unsub);
    if (es.stop) fns.unshift(stopPropagation);
    if (es.prevent) fns.unshift(preventDefault);
    if (es.kLen) cb = wrap_keys(cb, es);
    if (es.self) cb = wrap_self(cb);
    if (es.trusted) cb = wrap_trusted(cb);
    addEvent(target, es.type, cb, {
      passive: es.passive,
      capture: es.capture
    });
  } else {
    var unsubs = [];

    for (var i = 0; i < event.length; i++) {
      unsubs.push(native(target, event[i], listeners));
    }

    unsub = () => {
      for (; unsubs.length;) {
        unsubs.pop()();
      }
    };
  }

  return unsub;
} : noopNoop;

var cursor = (() => {
  if (!isBrowser) return noopNoop;

  var __composedPath__ = e => {
    var res = [];
    var el = e.target;

    do {
      res.push(el);
    } while (el = el.parentNode);

    res.push(window);
    return res;
  };

  var __abs__ = n => n < 0 ? -n : n;

  var __sum__ = a => {
    var res = 0;

    for (var i = a.length; i-- > 0;) {
      res += a[i];
    }

    return res;
  };

  var alloyPanAndMove = data => !data.xy || DIRECTION === DIRECTION_L && (data.x || data.l) || DIRECTION === DIRECTION_R && (data.x || data.r) || DIRECTION === DIRECTION_U && (data.y || data.u) || DIRECTION === DIRECTION_D && (data.y || data.d);

  var checkSelect = !isBrowser ? noop : window.getSelection ? () => {
    window.getSelection().removeAllRanges();
  } // @ts-ignore
  : () => {
    document.selection.empty();
  }; // const __WSEHOVERS__ = '__hovers__'
  // const __WSECURSOR__ = '__cursor__'
  // const __WSESIMPLE__ = '__simple__'

  var WMH = new WeakMap();
  var WMC = new WeakMap();
  var WMS = new WeakMap();
  var EVENT_START = 'start',
      EVENT_MOVE = 'move',
      EVENT_END = 'end';
  var EVENT_CLICK = 'click',
      EVENT_DBLCLICK = 'dblclick';
  var EVENT_PAN = 'pan',
      EVENT_PRESS = 'press',
      EVENT_REPEAT = 'repeat';
  var EVENT_HOVER_IN = 'hoverin',
      EVENT_HOVER_OUT = 'hoverout';
  var EVENT_FOCUS_IN = 'focusin',
      EVENT_FOCUS_OUT = 'focusout';
  var DIRECTION_U = 'up',
      DIRECTION_D = 'down';
  var DIRECTION_L = 'left',
      DIRECTION_R = 'right';
  var target;

  var createDetail = (type, event) => ({
    type: type,
    target,
    direction: DIRECTION,
    isFirst: IS_FIRST,
    isFinal: IS_FINAL,
    page: {
      x: _pageX,
      y: _pageY
    },
    delta: {
      x: _deltaX,
      y: _deltaY
    },
    offset: {
      x: _offsetX,
      y: _offsetY
    },
    client: {
      x: _clientX,
      y: _clientY
    },
    screen: {
      x: _screenX,
      y: _screenY
    },
    isTrusted: event.isTrusted,
    event: event
  });

  var runHovers = (el, type, event) => {
    var wseh = WMH.get(el);

    if (wseh && type in wseh) {
      var items = wseh[type];

      for (var fns, i = 0; fns = items[i], i < items.length; i++) {
        for (var j = 0; j < fns.length; j++) {
          fns[j](createDetail(type, event));
        }

        if (!fns.length) items.splice(i--, 1);
      }

      if (!items.length) delete wseh[type];
    }
  };

  var DIRECTION;
  var IS_FIRST = false,
      IS_FINAL = false;
  var _clientX = 0,
      _clientY = 0,
      _screenX = 0,
      _screenY = 0,
      _pageX = 0,
      _pageY = 0,
      _offsetX = 0,
      _offsetY = 0,
      _deltaX = 0,
      _deltaY = 0;
  var directionXArr = [0, 0, 0, 0, 0];
  var directionYArr = [0, 0, 0, 0, 0];
  var timer, timerStart, timerEnd;
  var isFinal = false,
      isPaning = false,
      isPress = false;
  var STI = [];
  var lastHovered = {};
  var lastFocused = {};
  var lastHoveredList = [];
  var lastFocusedList = [];
  var lastStarted = {};

  var update = (e, headtype, isMouse) => {
    // console.log(e)
    // @ts-ignore
    if (!isMouse && e.touches.length !== 1) return;
    var nextHovered = target = e.target;
    var nextFocused = headtype !== EVENT_MOVE ? nextHovered : lastFocused;
    var needUpdateHovered = lastHovered !== nextHovered;
    var needUpdateFocused = lastFocused !== nextFocused; // @ts-ignore

    var {
      clientX,
      clientY,
      pageX,
      pageY,
      screenX,
      screenY
    } = isMouse ? e : e.touches[0] || {
      clientX: _clientX,
      clientY: _clientY,
      pageX: _pageX,
      pageY: _pageY,
      screenX: _screenX,
      screenY: _screenY
    };
    timer = e.timeStamp;
    isFinal = false;

    if (headtype === EVENT_MOVE) {
      if (isPress && !isPaning) isPaning = true;
    } else {
      STI.forEach(clearInterval), STI.length = 0;

      if (headtype === EVENT_START) {
        lastStarted = target;
        isPress = true;
        timerStart = timer;
        _clientX = clientX, _clientY = clientY, _offsetX = _offsetY = 0;
      } else {
        isPress = false;
        timerEnd = timer;
        if (isPaning) isPaning = !(isFinal = true);
      }
    } // не меняй их местами


    _deltaX = -_clientX + (_clientX = clientX);
    _deltaY = -_clientY + (_clientY = clientY);
    _offsetX += _deltaX, _offsetY += _deltaY;
    _screenX = screenX, _screenY = screenY;
    _pageX = pageX, _pageY = pageY;
    var dist2 = (__abs__(_offsetX) + __abs__(_offsetY)) * 1000;
    directionXArr.shift(), directionYArr.shift();
    directionXArr.push(_deltaX), directionYArr.push(_deltaY);

    var dirX = __sum__(directionXArr),
        dirY = __sum__(directionYArr);

    DIRECTION = __abs__(dirX) > __abs__(dirY) ? dirX < 0 ? DIRECTION_L : DIRECTION_R : dirY < 0 ? DIRECTION_U : DIRECTION_D;

    if (needUpdateHovered || needUpdateFocused) {
      var path = e.composedPath && e.composedPath() || __composedPath__(e);

      var pathlen = path.length - 2;

      if (needUpdateHovered) {
        lastHovered = nextHovered;
        var nextHoveredList = path;
        var nhi = pathlen;
        var lhi = lastHoveredList.length - 2;

        for (;;) {
          if (nextHoveredList[nhi] === lastHoveredList[lhi]) nhi--, lhi--;else break;
        }

        for (; lhi >= 0; lhi--) {
          runHovers(lastHoveredList[lhi], EVENT_HOVER_OUT, e);
        }

        for (; nhi >= 0; nhi--) {
          runHovers(nextHoveredList[nhi], EVENT_HOVER_IN, e);
        }

        lastHoveredList = nextHoveredList;
      }

      if (needUpdateFocused) {
        lastFocused = nextFocused;
        var nextFocusedList = path;
        var nfi = pathlen;
        var lfi = lastFocusedList.length - 2;

        for (;;) {
          if (nextFocusedList[nfi] === lastFocusedList[lfi]) nfi--, lfi--;else break;
        }

        for (; lfi >= 0; lfi--) {
          runHovers(lastFocusedList[lfi], EVENT_FOCUS_OUT, e);
        }

        for (; nfi >= 0; nfi--) {
          runHovers(nextFocusedList[nfi], EVENT_FOCUS_IN, e);
        }

        lastFocusedList = nextFocusedList;
      }
    }

    var STOPS = {};
    var element, wsec, item, es, callback, addition, type;

    for (element = target; element; element = element.parentNode) {
      if (wsec = WMS.get(element)) {
        for (var i = 0; i < wsec.length; i++) {
          if ((item = wsec[i])[1] === noop) {
            wsec.splice(i--, 1);

            if (!wsec.length) {
              WMS.delete(element), WMC.has(element) || delGlobalPreventDefault(element);
            }
          } else if (!((type = (es = item[0]).type) in STOPS)) {
            if (es.stop) STOPS[type] = true;
            callback = item[1], addition = item[2];

            if (headtype !== EVENT_MOVE || alloyPanAndMove(es)) {
              callback(createDetail(type, e));
            }
          }
        }
      }
    }

    for (element = lastStarted; element; element = element.parentNode) {
      if (wsec = WMC.get(element)) {
        for (var _i = 0; _i < wsec.length; _i++) {
          if ((item = wsec[_i])[1] === noop) {
            wsec.splice(_i--, 1);

            if (!wsec.length) {
              WMC.delete(element), WMS.has(element) || delGlobalPreventDefault(element);
            }
          } else if (!((type = (es = item[0]).type) in STOPS)) {
            if (es.stop) STOPS[type] = true;
            callback = item[1], addition = item[2];

            switch (type) {
              case EVENT_CLICK:
                if (headtype === EVENT_END && timerEnd - timerStart < es.num) {
                  callback(createDetail(type, e));
                }

                break;

              case EVENT_DBLCLICK:
                if (headtype === EVENT_END) {
                  if (timerEnd - (addition.s || 0) > es.num) addition.is = 0;

                  if (addition.is = ++addition.is | 0) {
                    if (addition.is === 1) addition.s = timerStart;else addition.is = 0, callback(createDetail(type, e));
                  }
                }

                break;

              case EVENT_PAN:
                if (headtype === EVENT_MOVE && isPress || isFinal) {
                  if (isFinal && addition.is || dist2 > es.num && alloyPanAndMove(es)) {
                    if (IS_FINAL = isFinal) addition.is = false;else if (!addition.is) IS_FIRST = addition.is = true;
                    checkSelect(), callback(createDetail(type, e));
                    IS_FIRST = IS_FINAL = false;
                  }
                }

                break;

              case EVENT_PRESS:
              case EVENT_REPEAT:
                if (headtype === EVENT_START) {
                  STI.push(addition.sti = setInterval((type, e, add) => {
                    type === EVENT_PRESS && clearInterval(add.sti);
                    checkSelect(), callback(createDetail(type, e));
                  }, es.num, type, e, addition));
                }

                break;
              // throw type
            }
          }
        }
      }
    } // console.log(e.path, e.composedPath(), composedPath(e))


    if (headtype === EVENT_END) {
      _clientX = clientX, _clientY = clientY, _offsetX = _offsetY = 0;
    }
  };

  var obj;

  if (isPointers) {
    obj = {
      pointerdown: e => {
        update(e, EVENT_START, true);
      },
      pointermove: e => {
        update(e, EVENT_MOVE, true);
      },
      pointerup: e => {
        update(e, EVENT_END, true);
      },
      pointercancel: e => {
        update(e, EVENT_END, true);
      }
    };
  } else {
    // For bug in dev tools
    var __type__ = 0;

    var mouseWrapper = (e, type) => {
      ++__type__ >= (__type__ = 1) && update(e, type, true);
    };

    var touchWrapper = (e, type) => {
      --__type__ <= (__type__ = -1) && update(e, type, false);
    };

    obj = {
      mousedown: e => {
        mouseWrapper(e, EVENT_START);
      },
      mousemove: e => {
        mouseWrapper(e, EVENT_MOVE);
      },
      mouseup: e => {
        mouseWrapper(e, EVENT_END);
      },
      touchstart: e => {
        touchWrapper(e, EVENT_START);
      },
      touchmove: e => {
        touchWrapper(e, EVENT_MOVE);
      },
      touchend: e => {
        touchWrapper(e, EVENT_END);
      },
      touchcancel: e => {
        touchWrapper(e, EVENT_END);
      }
    };
  }

  var EVENTS_FOR_RESET = ['click', 'dblclick'];

  for (var event in obj) {
    addEvent(document, event, obj[event], false), EVENTS_FOR_RESET.push(event);
  }

  var setGlobalPreventDefault = el => {
    for (var i = 0; i < EVENTS_FOR_RESET.length; i++) {
      addEvent(el, EVENTS_FOR_RESET[i], preventDefault, {
        passive: false
      });
    }
  };

  var delGlobalPreventDefault = el => {
    for (var i = 0; i < EVENTS_FOR_RESET.length; i++) {
      delEvent(el, EVENTS_FOR_RESET[i], preventDefault);
    }
  };

  var cursor = (target, event, listeners) => {
    var unsub;

    if (!isArray(event)) {
      // @ts-ignore
      var fns = [].concat(listeners);
      var es = getEventSettings(event);
      var TYPE = es.type;
      var isSimple = false;

      switch (TYPE) {
        case EVENT_HOVER_IN:
        case EVENT_HOVER_OUT:
        case EVENT_FOCUS_IN:
        case EVENT_FOCUS_OUT:
          {
            unsub = () => {
              fns.length = 0;
            };

            if (es.once) fns.push(unsub);
            var wseh = WMH.get(target) || wmset(WMH, target, {});
            TYPE in wseh ? wseh[TYPE].push(fns) : wseh[TYPE] = [fns];
            break;
          }

        case EVENT_START:
        case EVENT_MOVE: // @ts-ignore
        // eslint-disable-next-line no-fallthrough

        case EVENT_END:
          isSimple = true;
        // eslint-disable-next-line no-fallthrough

        case EVENT_CLICK:
        case EVENT_DBLCLICK:
        case EVENT_PAN:
        case EVENT_PRESS:
        case EVENT_REPEAT:
          {
            unsub = () => {
              fns.length = 0, item[1] = noop;
            };

            var cb = wrap_base(fns);
            if (es.once) fns.push(unsub);
            if (es.kLen) cb = wrap_keys(cb, es);
            if (es.self) cb = wrap_self(cb);
            if (es.trusted) cb = wrap_trusted(cb);

            if (!(WMS.has(target) || WMC.has(target))) {
              setGlobalPreventDefault(target);
            }

            var item = [es, cb, {}];
            var WM = isSimple ? WMS : WMC;
            var a = WM.get(target) || wmset(WM, target, []);
            a.push(item);
            break;
          }

        default:
          throw event;
      } // console.log(es)
      // type in wse ? wse[type].push(item) : wse[type] = [item]

    } else {
      var unsubs = [];

      unsub = () => {
        for (; unsubs.length;) {
          unsubs.pop()();
        }
      };

      for (var i = 0; i < event.length; i++) {
        unsubs.push(cursor(target, event[i], listeners));
      }
    }

    return unsub;
  };

  return cursor;
})();
/* filename: index.ts
  timestamp: 2022-04-12T14:33:55.886Z */


var index = {
  resize,
  keypad,
  native,
  cursor
};
exports.cursor = cursor;
exports["default"] = index;
exports.keypad = keypad;
exports.native = native;
exports.resize = resize;
