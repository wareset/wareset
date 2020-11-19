import { inArr } from 'wareset-utilites';

export const watchableFactory = (
  // isStore: any,
  args: any, // = ['__watchables', '__watched', 'unwatch', 'watch', false, [1]]
  _UPDATE_VALUE_: string
): any => {
  function _unwatchable_(self: any, store: any): any {
    if (self.isStore(store)) {
      const index = self._[args[0]].indexOf(store);
      if (index !== -1) {
        self._[args[0]].splice(index, 2);
        if (inArr(store._[args[1]], self)) store[args[2]](self);
      }
    } else if (Array.isArray(store)) {
      store.forEach((v) => _unwatchable_(self, v));
    }
    return self;
  }

  function _watchable_(self: any, store: any, deep: any /* = -1 */): any {
    if (self.isStore(store)) {
      if (store !== self) {
        _unwatchable_(self, store), self._[args[0]].push(store, deep);
        if (!inArr(store._[args[1]], self)) {
          store[args[3]](self, deep);
        }
        store._[_UPDATE_VALUE_]((args[4] ? self : store).get(), deep, args[5]);
      }
    } else if (Array.isArray(store)) {
      _unwatchable_(self, self._[args[0]]);
      if (self._[args[0]].length) return _watchable_(self, store, deep);
      store.forEach((v) => _watchable_(self, v, deep));
    }
    return self;
  }

  return [_unwatchable_, _watchable_];
};

export const watchFactory = (
  // isStore: any,
  args: any // = ['__watched', '__watchables', 'unwatchable', 'watchable']
): any => {
  function _unwatch_(self: any, store: any): any {
    if (self.isStore(store)) {
      const index = self._[args[0]].indexOf(store);
      if (index !== -1) {
        self._[args[0]].splice(index, 1);
        if (inArr(store._[args[1]], self)) store[args[2]](self);
      }
    } else if (Array.isArray(store)) {
      store.forEach((v) => _unwatch_(self, v));
    }
    return self;
  }

  function _watch_(self: any, store: any, deep: any /* = -1 */): any {
    if (self.isStore(store)) {
      if (store !== self) {
        _unwatch_(self, store), self._[args[0]].push(store);
        if (!inArr(store._[args[1]], self)) {
          store[args[3]](self, deep);
        }
      }
    } else if (Array.isArray(store)) {
      _unwatch_(self, self._[args[0]]);
      if (self._[args[0]].length) return _watch_(self, store, deep);
      store.forEach((v) => _watch_(self, v, deep));
    }
    return self;
  }

  return [_unwatch_, _watch_];
};

export const crossFactory = (
  // isStore: any,
  args: any // = ['_watchable_', 'unwatch', 'watch']
): any => {
  function _uncross_(self: any, store: any): any {
    if (self.isStore(store)) store[args[1]](self), self[args[1]](store);
    else if (Array.isArray(store)) store.forEach((v) => _uncross_(self, v));
    return self;
  }

  function _cross_(self: any, store: any, deep: any /* = -1 */): any {
    if (self.isStore(store)) {
      if (store !== self) {
        _uncross_(self, store);
        self[args[2]](store, deep), store[args[2]](self, deep);
      }
    } else if (Array.isArray(store)) {
      self[args[0]]([]);
      self[args[2]]([]), store.forEach((v) => _cross_(self, v, deep));
    }
    return self;
  }

  return [_uncross_, _cross_];
};
