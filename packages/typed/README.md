# `@wareset/typed`

Function for working with prototypes.
He can return the prototype, return the entire chain of prototypes, check the availability of prototypes.

## Installation

```bash
npm i @wareset/typed
```

or

```bash
yarn add @wareset/typed
```

## Usage

### Require or Import:

```js
const typed = require('@wareset/typed');
// or
import typed from '@wareset/typed';
```

### Method: `typed(value: any)`

Returns prototype:

```js
console.log(typed(undefined));
/* RETURN: */ undefined;
console.log(typed(null));
/* RETURN: */ null;

console.log(typed(Object)), /* or */ console.log(typed({ q: 1 }));
/* RETURN: */ Object.prototype;
console.log(typed(String)), /* or */ console.log(typed('string'));
/* RETURN: */ String.prototype;
console.log(typed(Number)), /* or */ console.log(typed(9999));
/* RETURN: */ Number.prototype;
// etc...

console.log(typed(() => {}));
/* RETURN: */ Function.prototype;
console.log(typed(async () => {}));
/* RETURN: */ AsyncFunction.prototype;

console.log(typed(SomeClass)), /* or */ console.log(typed(new SomeClass()));
/* RETURN: */ SomeClass.prototype;

const DIV = document.createElement('div');
console.log(typed(DIV));
/* RETURN: */ HTMLDivElement.prototype;
// etc...
```

### Method: `typed.of(value: any)`

Returns an array of all prototypes:

```js
console.log(typed.of(undefined));
/* RETURN: */ [undefined];
console.log(typed.of(null));
/* RETURN: */ [null];

console.log(typed.of(Object)) /* or */, console.log(typed.of({ q: 1 }));
/* RETURN: */ [Object.prototype];
console.log(typed.of(String)) /* or */, console.log(typed.of('string'));
/* RETURN: */ [String.prototype, Object.prototype];
// etc...

console.log(typed(() => {}));
/* RETURN: */ [Function.prototype, Object.prototype];
console.log(typed(async () => {}));
/* RETURN: */ [AsyncFunction.prototype, Function.prototype, Object.prototype];

const H1 = document.createElement('h1');
console.log(typed.of(H1));
/* RETURN: */ [
  HTMLHeadingElement.prototype,
  HTMLElement.prototype,
  Element.prototype,
  Node.prototype,
  EventTarget.prototype,
  Object.prototype,
];
// etc...
```

### Methods: `typed(value: any, ...types)` and `typed.of(value: any, ...types)`

Check the availability of prototypes:

```js
// typed
console.log(typed(9999, [Boolean, String, Node, {}, Object]));
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
