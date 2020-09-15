const { thisIsStore, inArr } = require('./index');

  // OBSERVABLE
function unobservable(store) {
  if (thisIsStore(store)) {
    const index = this.observables.indexOf(store);
    if (index !== -1) {
      this.observables.slice(index, 1);
      if (inArr(store._.observed, this.Writable)) {
        store._.unobserve(this.Writable);
      }
    }
  } else if (Array.isArray(store)) {
    store.forEach(v => unobservable(v));
  }
  return this.Writable;
}
function observable(store) {
  if (thisIsStore(store)) {
    if (store !== this.Writable) {
      unobservable(store), this.observables.push(store);
      if (!inArr(store._.observed, this.Writable)) {
        store._.observe(this.Writable);
      }
      store._.updateVAL(store.$, null, [1]);
    }
  } else if (Array.isArray(store)) {
    unobservable(this.observables);
    store.forEach(v => observable(v));
  }
  return this.Writable;
}

module.exports = {
  unobservable,
  observable
};
