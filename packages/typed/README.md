# `@wareset/typed`

He can return the constructor, return the entire chain of constructors, check the availability of constructors.

### Attention:

##### <=0.1.1

Version <=0.1.1 returns the prototypes and not the constructors!

##### >=0.2.3

Starting with the >=0.2.3 version, the method `typed.of` returns a `NULL`.
Technically, this is more correct, because `NULL` is also an object, but without a constructor.

## Installation

```bash
npm i @wareset/typed ## yarn add @wareset/typed
```

## Usage

### Import:

```js
import typed from '@wareset/typed';
```

### Method: `typed(value: any)`

Returns prototype:

```js
assert(typed(null), null);
assert(typed(undefined), undefined);

assert(typed('str'), String);
assert(typed(30401), Number);
assert(typed(false), Boolean);
assert(typed({ q: 1 }), Object);
// etc...

assert(
  typed(() => {}),
  Function
);
assert(
  typed(async () => {}),
  AsyncFunction
);

const DIV = document.createElement('div');
assert(typed(DIV), HTMLDivElement);
// etc...
```

### Method: `typed.of(value: any)`

Returns an array of all prototypes:

```js
assert(typed.of(null), [null]);
assert(typed.of(undefined), [undefined]);

assert(typed.of({ q: 1 }), [Object, null]);
assert(typed.of('string'), [String, Object, null]);
// etc...

assert(
  typed.of(() => {}),
  [Function, Object, null]
);
assert(
  typed.of(async () => {}),
  [AsyncFunction, Function, Object, null]
);

const H1 = document.createElement('h1');
console.log(typed.of(H1));
/* RETURN: */ [
  HTMLHeadingElement,
  HTMLElement,
  Element,
  Node,
  EventTarget,
  Object,
  null
];
// etc...
```

### Methods: `typed(value: any, ...types)` and `typed.of(value: any, ...types)`

Check the availability of prototypes:

```js
// typed
console.log(typed(9999, [Boolean, String, Element, {}, Object]));
/* RETURN: */ false; // because they are not a Number

console.log(typed(9999, Number));
console.log(typed(9999, [Number]));
console.log(typed(9999, 1111));
console.log(typed(9999, [Number, String])); // because there is a Number
/* RETURN: */ true;

// typed.of
console.log(typed.of(9999, [Boolean, String, Node]));
/* RETURN: */ false; // because they are not a Number or Object

console.log(typed.of(9999, Number));
console.log(typed.of(9999, [Object])); // because Object
console.log(typed.of(9999, [1111]));
/* RETURN: */ true;

// other
const someFn = () => {};
const someFnAsync = async () => {};

console.log(typed(someFn, Function)); // true
console.log(typed(someFn, () => {})); // true
console.log(typed.of(someFnAsync, someFn)); // true
console.log(typed.of(someFn, someFnAsync)); // false
console.log(typed(someFnAsync, someFn)); // false
console.log(typed(someFn, someFnAsync)); // false
// etc...
```

### Methods: `typed.check(value: any, ...types)` and `typed.of.check(value: any, ...types)`

Check the availability of prototypes:

```js
console.log(typed.check(9999)); // RETURN: 9999
console.log(typed.of.check(9999)); // RETURN: 9999

console.log(typed.check(9999, Number)); // RETURN: 9999
console.log(typed.of.check(9999, [String, Object])); // RETURN: 9999

console.log(typed.check(9999, String)); // throw new Error()
console.log(typed.of.check(9999, [String, Node])); // throw new Error()

// LIVE EXAMPLE:

function strictTypedFn(element, options = {}) {
  typed.of.check(element, Element), typed.check(options, Object);

  // some code ...
}

// This function will succeed:
try {
  strictTypedFn(document.createElement('div'), { param1: 1, param2: 2 });
} catch (err) {
  // ...
}

// This function will return an exception:
try {
  strictTypedFn(12, 'string');
} catch (err) {
  // ...
}
```

## License

MIT
