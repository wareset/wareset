import { inArr } from '@wareset/utilites';

export const watchableFactory = (
  SELF,
  watchables,
  args // = ['watched', 'unwatch', 'watch', false, [1]]
) => {
  const _unwatchable_ = store => {
    if (SELF._.isStore(store)) {
      const index = watchables.indexOf(store);
      if (index !== -1) {
        watchables.splice(index, 2);
        if (inArr(store._[args[0]], SELF)) store._[args[1]](SELF);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatchable_(v));
    }
    return SELF;
  };

  const _watchable_ = (store, deep /* = -1 */) => {
    if (SELF._.isStore(store)) {
      if (store !== SELF) {
        _unwatchable_(store), watchables.push(store, deep);
        if (!inArr(store._[args[0]], SELF)) {
          store._[args[2]](SELF, deep);
        }
        store._.updateVALUE(
          (args[3] ? SELF : store)._.VALUE,
          deep,
          args[4]
        );
      }
    } else if (Array.isArray(store)) {
      while (watchables.length) _unwatchable_(watchables);
      if (watchables.length) return _watchable_(store, deep);
      store.forEach(v => _watchable_(v, deep));
    }
    return SELF;
  };

  return [_unwatchable_, _watchable_];
};

export const watchFactory = (
  SELF,
  watched,
  args // = ['watchables', 'unwatchable', 'watchable']
) => {
  const _unwatch_ = store => {
    if (SELF._.isStore(store)) {
      const index = watched.indexOf(store);
      if (index !== -1) {
        watched.splice(index, 1);
        if (inArr(store._[args[0]], SELF)) store._[args[1]](SELF);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatch_(v));
    }
    return SELF;
  };

  const _watch_ = (store, deep /* = -1 */) => {
    if (SELF._.isStore(store)) {
      if (store !== SELF) {
        _unwatch_(store), watched.push(store);
        if (!inArr(store._[args[0]], SELF)) {
          store._[args[2]](SELF, deep);
        }
      }
    } else if (Array.isArray(store)) {
      while (watched.length) _unwatch_(watched);
      if (watched.length) return _watch_(store, deep);
      store.forEach(v => _watch_(v, deep));
    }
    return SELF;
  };

  return [_unwatch_, _watch_];
};

export const crossFactory = (
  SELF,
  _unwatch_,
  _watch_,
  _watchable_,
  args // = ['unwatch', 'watch']
) => {
  const _uncross_ = store => {
    if (SELF._.isStore(store)) store._[args[0]](SELF), _unwatch_(store);
    else if (Array.isArray(store)) store.forEach(v => _uncross_(v));
    return SELF;
  };

  const _cross_ = (store, deep /* = -1 */) => {
    if (SELF._.isStore(store)) {
      if (store !== SELF) {
        _uncross_(store);
        _watch_(store, deep), store._[args[1]](SELF, deep);
      }
    } else if (Array.isArray(store)) {
      // store = [...store].reverse();
      _watchable_([]), _watch_([]), store.forEach(v => _cross_(v, deep));
    }
    return SELF;
  };

  return [_uncross_, _cross_];
};
