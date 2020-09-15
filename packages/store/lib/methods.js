const { thisIsStore, inArr } = require('./index');

const watchable_factory = (
  Writable,
  watchables,
  args = ['observed', 'unobserve', 'observe', false, [1]]
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

  const _watchable_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _unwatchable_(store), watchables.push(store, deep);
        if (!inArr(store._[args[0]], Writable)) {
          store._[args[2]](Writable, deep);
        }
        store._.updateVAL((args[3] ? Writable : store)._.VAL, deep, args[4]);
      }
    } else if (Array.isArray(store)) {
      _unwatchable_(watchables), store.forEach(v => _watchable_(v, deep));
    }
    return Writable;
  };

  return [_unwatchable_, _watchable_];
};

const watch_factory = (
  Writable,
  watched,
  args = ['observables', 'unobservable', 'observable']
) => {
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

  const _watch_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _unwatch_(store), watched.push(store);
        if (!inArr(store._[args[0]], Writable)) {
          store._[args[2]](Writable, deep);
        }
      }
    } else if (Array.isArray(store)) {
      _unwatch_(watched), store.forEach(v => _watch_(v, deep));
    }
    return Writable;
  };

  return [_unwatch_, _watch_];
};

const cross_factory = (
  Writable,
  _unwatch_,
  _watch_,
  _watchable_,
  args = ['undepend', 'depend']
) => {
  const _uncross_ = store => {
    if (thisIsStore(store)) store._[args[0]](Writable), _unwatch_(store);
    else if (Array.isArray(store)) store.forEach(v => _uncross_(v));
    return Writable;
  };

  const _cross_ = (store, deep = -1) => {
    if (thisIsStore(store)) {
      if (store !== Writable) {
        _uncross_(store);
        _watch_(store, deep), store._[args[1]](Writable, deep);
      }
    } else if (Array.isArray(store)) {
      _watchable_([]), _watch_([]), store.forEach(v => _cross_(v, deep));
    }
    return Writable;
  };

  return [_uncross_, _cross_];
};

module.exports = {
  watchable_factory,
  watch_factory,
  cross_factory
};