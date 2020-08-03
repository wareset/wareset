# `@wareset/deep-equal`

Fast deep equal for `Object`, `Array`, `Map`, `Set` and other objects by `valueOf` and `toString`. This function is a redesigned function [fast-deep-equal](https://www.npmjs.com/package/fast-deep-equal). In short, the differences are only in methods `valueOf` and `toString` processing. In this function they are not checked for true objects (`deepEqual({q: 1 , w: 2, toString: () => 'Hello' }, { e: 3, r: 4, toString: () => 'Hello' })` return `false`). Because these methods don't mean equal objects, even if they were redefined.

# Usage

### Require or Import:

```js
const deepEqual = require('@wareset/deep-equal');
// or
import deepEqual from '@wareset/deep-equal';
```

### Method: `deepEqual(a: any, b: any, [deep: <Boolean, Number> = true])`

```js
deepEqual(a, b, true) /* or */ deepEqual(a, b) // infinity deep
deepEqual(a, b, false) // disabled deep
deepEqual(a, b, 1) // deep only once
deepEqual(a, b, 100) // deep 100
```

## License

MIT
