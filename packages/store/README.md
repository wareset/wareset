# `@wareset/store`

Fast and easy observer. It is very similar to a 'store/writable' from [Svelte](https://www.npmjs.com/package/svelte) and 'BehanivorSubject' from [rxjs](https://www.npmjs.com/package/rxjs). But it has a slightly different mechanism for handling the subscription queue.

# How to use:

## Installation:

```bash
npm i @wareset/store ## yarn add @wareset/store
```

#### store(value: any, observed?: Array, depended?: Array, start?: Function)

```javascript
import store from '@wareset/store';
const VAL$ = store(42);
```

The observer is a real regular array. The first element is reserved for storing the variable. This is how good compatibility is achieved.

#### Interesting moment:

Methods 'valueOf', 'toString' and 'toJSON' are forwarded from a stored variable. Therefore, the construction will work with primitives 'string' and 'number':

```javascript
assert(typeof VAL$, 'object');
assert(VAL$ instanceof Array, true);

// but
assert(VAL$ + 12, 54); // 42 + 12
assert(store('Hello') + ' world!', 'Hello world!');
assert([...store(42)], [42]);

JSON.stringify(store(42)); // '42'
JSON.stringify(store({ q: 1 })); // '{ "q": 1 }'
```

# Methods:

All methods are anonymous functions. Hence, they do not accept or change the context. All methods are synchronous!

## get

### get(), [0], \$, value

```javascript
assert(VAL$.get(), 42);
assert(VAL$[0], 42); // alias for 'get()' and 'set()'
assert(VAL$.$, 42); // alias for 'get()' and 'set()'
assert(VAL$.value, 42); // alias for 'get()' and 'set()'
```

## set, subscribe and update:

### set(newValue: any)

This method is similar to "set" from "svelte/store/writable" and "next" from "rxjs". But they always run subscribers if the value is an 'object'. This method doesn't do that. It always launches subscribers only if you pass a 'function'.

> If you need to force subscribers to start, use 'setSure'.
> If you don't need to call the same function, use 'setWeak'.

```javascript
VAL$.set(24);
assert(VAL$.get(), 24);

VAL$.next(12); // alias for 'set()'
assert(VAL$.get(), 12);

VAL$.$ = 25;
assert(VAL$.get(), 25);

VAL$[0] = 26;
assert(VAL$.get(), 26);

VAL$.value = 27;
assert(VAL$.get(), 27);
```

Subscriptions will be started if the value is 'different' from the previous one or if the value is a 'function'.

```javascript
const VAL$ = store(42);
VAL$.$ = 42; // Nothing will happen

function func() {}
const VAL_2$ = store(func);
VAL2$.$ = func; // Will launch all subscriptions
```

### setSure(newValue: any)

This will cause the subscriptions to run anyway.
The rest of the methods 'Sure' behave exactly the same.

```javascript
const VAL$ = store(42);
VAL$.setSure(42); // Will launch all subscriptions
```

### setWeak(newValue: any, deep?: Number = 0)

This is a soft test.
The rest of the methods 'Weak' behave exactly the same.

- deep - this is the depth of comparison for objects. See [@wareset/deep-equal](https://www.npmjs.com/package/@wareset/deep-equal)

```javascript
const obj = { q: 1 };
const VAL$ = store(obj);
VAL$.setWeak(obj, 0); // Nothing will happen
VAL$.setWeak({ q: 1 }, 0); // Will launch all subscriptions
VAL$.setWeak({ q: 1 }, 1); // Nothing will happen
```

### subscribe(callbackFn: (value, observed: Array, _this_: store, unsubscribe: Function))

```javascript
const VAL$ = store(42);

const unsubscribe = VAL$.subscribe((val, observed, this$, unsub) => {
  assert(val, VAL$.$);
  // observed - explained further in the text
  assert(this$, VAL$);
  assert(unsub, unsubscribe);

  console.log('Value:', val);

  return (val, observed, this$, unsub) => {
    // unsub - it won't work anymore
    // but if, on further calls, it will show the current value VAL$.$
    console.log('Subscription canceled! Value: ', val);
  };
});

VAL$.$ = VAL$.$ + 1; // 43
unsubscribe();

VAL$.$ = VAL$.$ + 1; // 44
unsubscribe();
```

console.log:

```console
Value: 42
Value: 43
Subscription canceled! Value: 43
Subscription canceled! Value: 44 ## unsubscribed, but show the current value
```

Example of start and end functions:

```javascript
const VAL$ = store(42, (val, observed, this$, unsub) => {
  console.log('The first subscriber appeared!');

  // unsub - this is unsubscribe for the first subscriber
  // For example, let's cancel it.
  unsub();

  return (val, observed, this$, unsub) => {
    // unsub - Backward compatibility stub () => {}
    console.log('All subscribers have unsubscribed!');
  };
});

VAL$.subscribe((val, observed, this$, unsub) => {
  console.log('I am subscribed! Value:', val);

  return (val, observed, this$, unsub) => {
    // unsub - Backward compatibility stub () => {}
    console.log('I was unsubscribed!');
  };
});
```

console.log:

```console
The first subscriber appeared!
I am subscribed! Value: 42!
I was unsubscribed!
All subscribers have unsubscribed!
```

### update(callbackFn: (value, observed: Array, _this_: store, noop: Function) => newValue)

- noop - Backward compatibility stub

### updateSure(callbackFn)

### updateWeak(callbackFn, deep)

```javascript
const VAL$ = store(42);

VAL$.subscribe(val => {
  console.log('Subscriber 1. Value:', val);
});

VAL$.subscribe(val => {
  console.log('Subscriber 2. Value:', val);
});

VAL$.update(val => {
  return val + 12;
});
```

console.log:

```console
Subscriber 1. Value: 42
Subscriber 2. Value: 42
Subscriber 1. Value: 54
Subscriber 2. Value: 54
```

## observe and unobserve:

### observe(stores: store | Array<store>)

### observeSure(stores)

### observeWeak(stores, deep)

These are obother observers whose updates affect subscriptions calls.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);

const VAL$ = store(42);
VAL$.observe([SUBVAL_1$, SUBVAL_2$]);
// or const VAL = store(42, [SUBVAL_1, SUBVAL_2]);
// or VAL$.observe(SUBVAL_1$).observe(SUBVAL_2$);
// But, when observers are in an array - previous observers are erased:
// VAL$.observe([SUBVAL_1$]).observe([SUBVAL_2$]); - will unobserve SUBVAL_1$

SUBVAL_1$.subscribe(subval_1 => {
  console.log('Subval_1: ', subval_1);
});

SUBVAL_2$.subscribe(subval_2 => {
  console.log('Subval_2: ', subval_2);
});

VAL$.subscribe((val, [subval_1, subval_2]) => {
  console.log('Value: ', val, 'Subvalues: ', [subval_1, subval_2]);
});

SUBVAL_1$.set(1);
SUBVAL_2$.set(1);
```

console.log:

```console
Subval_1: 0
Subval_2: 0
Value: 42 Subvalues: [0, 0]

Value: 42 Subvalues: [1, 0]
Subval_1: 1

Value: 42 Subvalues: [1, 1]
Subval_2: 1
```

'VAL' subscriptions will trigger earlier than subscriptions to 'SUBVAL_1' and 'SUBVAL_2'. Why is this needed? This mechanism has an interesting property - it filters out "extra calls" to subscriptions, if they are probably not needed yet.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);

const VAL$ = store(42, [SUBVAL_1$, SUBVAL_2$]);

SUBVAL_1$.subscribe(subval_1 => {
  console.log('Subval_1: ', subval_1);
});

SUBVAL_2$.subscribe(subval_2 => {
  console.log('Subval_2: ', subval_2);
});

VAL$.subscribe((val, [subval_1, subval_2]) => {
  console.log('Value: ', val, 'Subvalues: ', [subval_1, subval_2]);

  if (subval_1 < 2) ++SUBVAL_1$.$;
  if (subval_2 < 3) ++SUBVAL_2$.$;
});
```

console.log:

```console
Subval_1: 0
Subval_2: 0
Value: 42 Subvalues: [0, 0]

Value: 42 Subvalues: [1, 1]
Value: 42 Subvalues: [2, 2]
Value: 42 Subvalues: [2, 3]

Subval_2: 3
Subval_1: 2
```

This is magic for observed stores. When you update them inside subscription processing, this function will be called again to make sure the store is not changed again. And only then will the original subscriptions of the changed observers be called.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);

const VAL$ = store(0, [SUBVAL_1$, SUBVAL_2$]);

SUBVAL_1$.subscribe(subval_1 => {
  console.log('Subval_1: ', subval_1);
});

SUBVAL_2$.subscribe(subval_2 => {
  console.log('Subval_2: ', subval_2);
});

VAL$.subscribe((val, [subval_1, subval_2]) => {
  console.log('Value: ', val, 'Subvalues: ', [subval_1, subval_2]);

  if (subval_1 < 2) ++SUBVAL_1$.$;
  if (subval_2 < 3) ++SUBVAL_2$.$;

  VAL$.$ = SUBVAL_1$.$ + SUBVAL_2$.$;
});
```

console.log:

```console
Subval_1: 0
Subval_2: 0
Value: 0 Subvalues: [0, 0]

Value: 2 Subvalues: [1, 1]
Value: 4 Subvalues: [2, 2]
Value: 5 Subvalues: [2, 3]

Subval_2: 3
Subval_1: 2
```

### unobserve(stores: store | Array<store>)

Removes the observer from the 'observed'.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);
const VAL$ = store(42, [SUBVAL_1$, SUBVAL_2$]);

VAL$.unobserve(SUBVAL_2$);

VAL$.subscribe((val, [subval_1]) => {
  // ...
});
```

## observable and unobservable:

### observable(stores: store | Array<store>)

### observableSure(stores)

### observableWeak(stores, deep)

Like 'observe', just the opposite.

```javascript
const SUBVAL_1$ = store(0);
const VAL$ = store(42);

assert(VAL$.observe([SUBVAL_1$]), SUBVAL_1$.observable([VAL$]));
```

### unobservable(stores: store | Array<store>)

Like 'unobserve', just the opposite.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);
const VAL$ = store(42, [SUBVAL_1$, SUBVAL_2$]);

SUBVAL_2$.unobservable(VAL$);

VAL$.subscribe((val, [subval_1]) => {
  // ...
});
```

## depend and undepend:

### depend(stores: store | Array<store>)

### depend(stores)

### depend(stores, deep)

These are other observers whose updates update the current observer.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);

const VAL$ = store(0);
VAL$.depend([SUBVAL_1$, SUBVAL_2$]);
// or const VAL = store(42, [], [SUBVAL_1, SUBVAL_2]);
// or VAL$.depend(SUBVAL_1$).depend(SUBVAL_2$);
// But, when observers are in an array - previous observers are erased:
// VAL$.depend([SUBVAL_1$]).depend([SUBVAL_2$]); - will undeped SUBVAL_1$

SUBVAL_1$.subscribe(subval_1 => {
  console.log('Subval_1: ', subval_1);
});

SUBVAL_2$.subscribe(subval_2 => {
  console.log('Subval_2: ', subval_2);
});

VAL$.subscribe(val => {
  console.log('Value: ', val);
});

SUBVAL_1$.set(1);
SUBVAL_2$.set(5);
```

console.log:

```console
Subval_1: 0
Subval_2: 0
Value: 0

Value: 1
Subval_1: 1

Value: 5
Subval_2: 5
```

This is magic for depend stores:

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);

const VAL$ = store(0);
VAL$.depend([SUBVAL_1$, SUBVAL_2$]);

SUBVAL_1$.subscribe(subval_1 => {
  console.log('Subval_1: ', subval_1);
});

SUBVAL_2$.subscribe(subval_2 => {
  console.log('Subval_2: ', subval_2);
});

VAL$.subscribe(val => {
  console.log('Value: ', val);

  if (SUBVAL_1$.$ < 2) ++SUBVAL_1$.$;
  if (SUBVAL_2$.$ < 3) ++SUBVAL_2$.$;

  VAL$.$ = SUBVAL_1$.$ + SUBVAL_2$.$;
});
```

console.log:

```console
Subval_1: 0
Subval_2: 0
Value: 0

Subval_1: 1
Value: 1
Subval_1: 2
Value: 2

Subval_2: 1
Value: 1
Subval_2: 2
Value: 2
Subval_2: 3
Value: 3

Value: 5
```

Observers are updated in turn. And the final result will only be at the end.

### undepend(stores: store | Array<store>)

Removes the observer from the 'depended'.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);
const VAL$ = store(42, [], [SUBVAL_1$, SUBVAL_2$]);

VAL$.undepend(SUBVAL_2$);
```

## dependency and undependency:

### dependency(stores: store | Array<store>)

### dependencySure(stores)

### dependencyWeak(stores, deep)

Like 'depend', just the opposite.

```javascript
const SUBVAL_1$ = store(0);
const VAL$ = store(42);

assert(VAL$.depend([SUBVAL_1$]), SUBVAL_1$.dependency([VAL$]));
```

### undependency(stores: store | Array<store>)

Like 'undepend', just the opposite.

```javascript
const SUBVAL_1$ = store(0);
const SUBVAL_2$ = store(0);
const VAL$ = store(42, [], [SUBVAL_1$, SUBVAL_2$]);

SUBVAL_2$.undependency(VAL$);
```

## bridge and unbridge:

### bridge(stores: store | Array<store>)

### bridgeSure(stores)

### bridgeWeak(stores, deep)

Establishes interdependence between observers

```javascript
const VAL_1$ = store(0);
const VAL_2$ = store(0);
const VAL_3$ = store(0);

VAL_1$.bridge([VAL_2$, VAL_3$]);
/*
this is like:
VAL_1$.depend(VAL_2$).depend(VAL_3$);
VAL_2$.depend(VAL_1$).depend(VAL_3$);
VAL_3$.depend(VAL_1$).depend(VAL_2$);
*/

// or VAL_2$.bridge([VAL_1$, VAL_3$]);
// or VAL_3$.bridge([VAL_1$, VAL_2$]);

VAL_1$.subscribe(val_1 => console.log('Val_1:', val_1));
VAL_2$.subscribe(val_2 => console.log('Val_2:', val_2));
VAL_3$.subscribe(val_3 => console.log('Val_3:', val_3));

++VAL_1$.$;
++VAL_2$.$;
++VAL_3$.$;
```

console.log:

```console
Val_1: 0
Val_2: 0
Val_3: 0

Val_3: 1
Val_2: 1
Val_1: 1

Val_3: 2
Val_1: 2
Val_2: 2

Val_2: 3
Val_1: 3
Val_3: 3
```

### unbridge(stores: store | Array<store>)

Removes the 'bridge'.

```javascript
const VAL_1$ = store(0);
const VAL_2$ = store(0);
const VAL_3$ = store(0);

VAL_1$.bridge([VAL_2$, VAL_3$]);
VAL_1$.unbridge(VAL_3$);

// VAL_3$ no longer depends on and does not affect the VAL_1$ and VAL_2$
```

## Lisence

MIT

```

```
