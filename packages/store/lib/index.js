class WaresetStore extends Array {
  static isStore(store) {
    return store instanceof WaresetStore;
  }
  // static get [Symbol.species]() {
  //   return Array;
  // }
}
class Store extends WaresetStore {}

const isStore = Store.isStore;

module.exports = {
  WaresetStore,
  Store,
  isStore
};
