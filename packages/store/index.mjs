import { Store, storeSubscribe, storeListener } from './lib';
export { Store, isStore, storeDestroy } from './lib';

var n = (t, o, r, s) => new Store(t, o, r, s),
    c = storeSubscribe,
    p = storeListener;

var storeOnSubscribe = (e, t, o) => p(e, 'subscribe', t, o);

var storeOnDestroy = (e, t, o) => p(e, 'destroy', t, o);

var storeOnUpdate = (e, t, o) => p(e, 'update', t, o);

var storeOnChange = (e, t, o) => p(e, 'change', t, o);

export default n;
export { n as store, p as storeListener, storeOnChange, storeOnDestroy, storeOnSubscribe, storeOnUpdate, c as storeSubscribe };
