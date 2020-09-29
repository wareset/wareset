"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crossFactory = exports.watchFactory = exports.watchableFactory = void 0;

function _utilites() {
  const data = require("@wareset/utilites");

  _utilites = function () {
    return data;
  };

  return data;
}

const watchableFactory = (SELF, watchables, args // = ['watched', 'unwatch', 'watch', false, [1]]
) => {
  const _unwatchable_ = store => {
    if (SELF._.isStore(store)) {
      const index = watchables.indexOf(store);

      if (index !== -1) {
        watchables.splice(index, 2);
        if ((0, _utilites().inArr)(store._[args[0]], SELF)) store._[args[1]](SELF);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatchable_(v));
    }

    return SELF;
  };

  const _watchable_ = (store, deep
  /* = -1 */
  ) => {
    if (SELF._.isStore(store)) {
      if (store !== SELF) {
        _unwatchable_(store), watchables.push(store, deep);

        if (!(0, _utilites().inArr)(store._[args[0]], SELF)) {
          store._[args[2]](SELF, deep);
        }

        store._.updateVALUE((args[3] ? SELF : store)._.VALUE, deep, args[4]);
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

exports.watchableFactory = watchableFactory;

const watchFactory = (SELF, watched, args // = ['watchables', 'unwatchable', 'watchable']
) => {
  const _unwatch_ = store => {
    if (SELF._.isStore(store)) {
      const index = watched.indexOf(store);

      if (index !== -1) {
        watched.splice(index, 1);
        if ((0, _utilites().inArr)(store._[args[0]], SELF)) store._[args[1]](SELF);
      }
    } else if (Array.isArray(store)) {
      store.forEach(v => _unwatch_(v));
    }

    return SELF;
  };

  const _watch_ = (store, deep
  /* = -1 */
  ) => {
    if (SELF._.isStore(store)) {
      if (store !== SELF) {
        _unwatch_(store), watched.push(store);

        if (!(0, _utilites().inArr)(store._[args[0]], SELF)) {
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

exports.watchFactory = watchFactory;

const crossFactory = (SELF, _unwatch_, _watch_, _watchable_, args // = ['unwatch', 'watch']
) => {
  const _uncross_ = store => {
    if (SELF._.isStore(store)) store._[args[0]](SELF), _unwatch_(store);else if (Array.isArray(store)) store.forEach(v => _uncross_(v));
    return SELF;
  };

  const _cross_ = (store, deep
  /* = -1 */
  ) => {
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

exports.crossFactory = crossFactory;