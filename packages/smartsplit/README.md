# `@wareset/smartsplit`

Converts a string to an array, including quotation marks.

# Usage

```js
import smartsplit from '@wareset/smartsplit';
```

### Method: `smartsplit(string: String, delimeter = ',\\t', quotes = '\'"`')`

```js
const attrs =
  "q1, q2 ,q3,q4'4 , \"q5, q5-1\", 'q6, q6'1, q6-2', " +
  'q7 ` "q-7-1, q7-2" q7-3 ` ,q8 `q-8-1`, q9, q10';

console.log(smartsplit(attrs, ','));
/* RESULT: */
[
  'q1',
  'q2',
  'q3',
  "q4'4",
  '"q5, q5-1"',
  `'q6, q6'1, q6-2'`,
  'q7 ` "q-7-1, q7-2" q7-3 `',
  'q8 `q-8-1`',
  'q9',
  'q10'
];

console.log(smartsplit('data-attr  class="qwqw {`ewwe` || \'sdsd\'}"', ' '));
/* RESULT: */
['data-attr', '', 'class="qwqw {`ewwe` || \'sdsd\'}"'];
```

## License

MIT
