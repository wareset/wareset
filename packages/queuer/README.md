# `@wareset/queuer`

Runs synchronous and asynchronous functions in turn

## Installation

```bash
npm i @wareset/queuer ## yarn add @wareset/queuer
```

## Usage

#### `queuer(data?: any, callbacks: Array)`

- data - Input data for the first function
- callbacks - Array of functions and more. (If the value is not a function, it will be wrapped in a function that returns this value)

All functions will start in turn, whether they are synchronous or asynchronous.

```js
import { Queuer } from '@wareset/queuer';

const timeout = (time, cb) => {
  (time = time || 0), (cb = cb || () => {});
  return new Promise(resolve => setTimeout(() => resolve(cb()), time));
};

const queuer = Queuer();


queuer('FIRST_DATA', [
  firstData => {
    queuer(firstData, [
      data => console.log('1', data) || 'after 1',

      data => {
        queuer([
          // Automatically turns into a function
          console.log('2', data) || 'after 2',

          async data => {
            await timeout(500, () => console.log('...SLEEP 500'));
            return 'after SLEEP 500';
          },

          data => console.log('2-1', data) || 'after 2-1',
          data => console.log('2-2', data) || 'after 2-2',

          async data => {
            await timeout(1000, () => console.log('...SLEEP 1000'));
            return 'after SLEEP 1000';
          },

          data => console.log('2-3', data) || 'after 2-3',
        ]);

        return 'SECOND_DATA ';
      },

      data => console.log('3', data) || 'after 3',
      data => console.log('4', data) || 'after 4',
      data => console.log('5', data) || 'after 5',
      data => console.log('6', data) || 'after 6'
    ]);
  },

  () => {
    queuer('SOME_DATA', [
      data => console.log('7', data) || 'after 7',
      data => console.log('8', data) || 'after 8',
      data => console.log('9', data) || 'after 9',
      data => console.log('10', data) || 'after 10',
      data => console.log('11', data) || 'after 11',
      data => console.log('12', data) || 'after 12'
    ]);
  }
]);

```

console.log:

```console
1 FIRST_DATA
2 after 1

...SLEEP 500
2-1 after SLEEP 500
2-2 after 2-1

...SLEEP 1000
2-3 after SLEEP 1000
3 SECOND_DATA
4 after 3
5 after 4
6 after 5

7 SOME_DATA
8 after 7
9 after 8
10 after 9
11 after 10
12 after 11

```

## License

MIT
