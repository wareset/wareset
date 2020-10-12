# `@wareset/smartsplit`

Converts a string to an array, taking quotes or brackets.

# Usage

```js
import smartsplit from '@wareset/smartsplit';
```

##### Method: smartsplit(string: String, separator: String|RegExp = /\s*(,)\s*/, quotes: String|RegExp = /'|"|`/)

```js
const attrs1 = `
q1, q2 ,q3,q4'4 ,
"q5, q5-1"       ,         'q6, q6'1  , q6-2'
'q7 \` "q-7-1, q7-2" q7-3 \` , q8 "q-8-1" \t q9, q10
`;

// /'|"|`/ == '\'"`'
const res = smartsplit(attrs1, /\s*(,|\n|\t)\s*/, '\'"`');
console.log(res.join('\n--------\n'));
```

console.log:

```console
--------
q1
--------
q2
--------
q3
--------
q4'4
--------
"q5, q5-1"
--------
'q6, q6'1  , q6-2'
--------
'q7 ` "q-7-1, q7-2" q7-3 `
--------
q8 "q-8-1"
--------
q9
--------
q10
--------
```

##### Method: smartsplit(string, separator, bracketsOpen: String|RegExp, bracketsClose: String|RegExp)

```js
const attrs = `
div(class="button",
  style="color: red",
  data="{ q1: 1, q2: testFn() }")

  mixin testMixin[
    { ...someData }
  ]

  span(class="button__ripple")
    span

  if(iconBefore): span.button__icon-before -- {
    iconBefore === 'menu' ? defaultIconMenu : iconBefore }

  span.button__text -- textContent

  if(iconAfter)
    span(class="button__icon-after") -- {iconAfter}
`;

// const res = smartsplit(attrs, '\n', '({\\[', '\\]})');
const res = smartsplit(attrs, '\n', /\(|\{|\[/, /\]|\}|\)/);
console.log(res.join('\n--------\n'));
```

console.log:

```console
--------
div(class="button",
  style="color: red",
  data="{ q1: 1, q2: testFn() }")
--------

--------
  mixin testMixin[
    { ...someData }
  ]
--------

--------
  span(class="button__ripple")
--------
    span
--------

--------
  if(iconBefore): span.button__icon-before -- {
    iconBefore === 'menu' ? defaultIconMenu : iconBefore
  }
--------

--------
  span.button__text -- textContent
--------

--------
  if(iconAfter)
--------
    span(class="button__icon-after") -- {iconAfter}
--------
```

```js
const attrs = `
class="cl1 cl2", style="color: red",
arr1=" [1, 2, 3] ", arr2=[1, 2, 3], arr3={[1, 2, 3]}
obj={{
  q1: 1,
  q2: 2
}}
`;

const res = smartsplit(attrs, /(,|\s|\n)+/, /"|\{|\[/, /\]|\}|"/);
console.log(res.join('\n--------\n'));
```

console.log:

```console
--------
class="cl1 cl2"
--------
style="color: red"
--------
arr1=" [1, 2, 3] "
--------
arr2=[1, 2, 3]
--------
arr3={[1, 2, 3]}
--------
obj={{
  q1: 1,
  q2: 2
}}
--------
```

## License

MIT
