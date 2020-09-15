const { thisIsStore, inArr } = require('./index');

const unwatchable = (
  Writable,
  watchables,
  args = ['observed', 'unobserve']
) => {
  const _unwatchable_ = store => {
    if (thisIsStore(store)) {
      const index = watchables.indexOf(store);
      if (index !== -1) {
        watchables.splice(index, 2);
        if (inArr(store._[args[0]], Writable)) store._[args[1]](Writable);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatchable_(v));
    }
    return Writable;
  };

  return _unwatchable_;
};

const watchable = (
  Writable,
  watchables,
  _unwatchable_,
  args = ['observed', 'observe', false, [1]]
) => {
  const _watchable_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _unwatchable_(store), watchables.push(store, deep);
        if (!inArr(store._[args[0]], Writable)) {
          store._[args[1]](Writable, deep);
        }
        store._.updateVAL((args[2] ? Writable : store)._.VAL, deep, args[3]);
      }
    } else if (Array.isArray(store)) {
      _unwatchable_(watchables), store.forEach(v => _watchable_(v, deep));
    }
    return Writable;
  };

  return _watchable_;
};

const unwatch = (Writable, watched, args = ['observables', 'unobservable']) => {
  const _unwatch_ = store => {
    if (thisIsStore(store)) {
      const index = watched.indexOf(store);
      if (index !== -1) {
        watched.splice(index, 1);
        if (inArr(store._[args[0]], Writable)) store._[args[1]](Writable);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatch_(v));
    }
    return Writable;
  };

  return _unwatch_;
};

const watch = (
  Writable,
  watched,
  _unwatch_,
  args = ['observables', 'observable']
) => {
  const _watch_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _unwatch_(store), watched.push(store);
        if (!inArr(store._[args[0]], Writable)) {
          store._[args[1]](Writable, deep);
        }
      }
    } else if (Array.isArray(store)) {
      _unwatch_(watched), store.forEach(v => _watch_(v, deep));
    }
    return Writable;
  };

  return _watch_;
};

const uncross = (Writable, _unwatch_, args = ['undepend']) => {
  const _uncross_ = store => {
    if (thisIsStore(store)) store._[args[0]](Writable), _unwatch_(store);
    else if (Array.isArray(store)) store.forEach(v => _uncross_(v));
    return Writable;
  };

  return _uncross_;
};
const cross = (
  Writable,
  _uncross_,
  _watch_,
  _watchable_,
  args = ['depend']
) => {
  const _cross_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _uncross_(store);
        _watch_(store, deep), store._[args[0]](Writable, deep);
      }
    } else if (Array.isArray(store)) {
      _watchable_([]), _watch_([]), store.forEach(v => _cross_(v, deep));
    }
    return Writable;
  };

  return _cross_;
};

module.exports = {
  unwatchable,
  watchable,
  unwatch,
  watch,
  uncross,
  cross
};
