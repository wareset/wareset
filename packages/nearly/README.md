# `@wareset/nearly`

Returns the nearest value from the array, or from a pattern.

## Installation

```bash
npm i @wareset/nearly ## yarn add @wareset/nearly
```

## Usage

#### `nearly(value: Number, pattern: Array<Number> | Number, method: -1 | 0 | 1)`

'method':

- -1 - floor
- 0 - round // By default
- 1 - ceil

```js
import nearly from '@wareset/nearly';

// If the pattern is an array, returns the nearest value.
assert(nearly(1.25, [1, 1.24, 1.26, 2], -1), 1.24);
assert(nearly(1.25, [1, 1.24, 1.26, 2], 0), 1.26);
assert(nearly(1.25, [1, 1.24, 1.26, 2], 1), 1.26);

// If the pattern is a number, it returns a multiple of it.
assert(nearly(3040.10576, 150.101, -1), 3002.02);
assert(nearly(3040.10576, 150.101, 0), 3002.02);
assert(nearly(3040.10576, 150.101, 1), 3152.121);

// If the pattern is zero, it returns standard rounding.
assert(nearly(3040.10576, 0, -1), Math.floor(3040.10576));
assert(nearly(3040.10576, 0, 0), Math.round(3040.10576));
assert(nearly(3040.10576, 0, 1), Math.ceil(3040.10576));
```

## License

MIT
