console.log(1122); // queuer([
//   () => {
//     queuer([
//       () => console.log('1'),
//       async () => {
//         await timeout(500);
//         console.log('2');
//         await timeout(500);
//         queuer([() => console.log('2-1'), () => console.log('2-2')]);
//         console.log('2');
//         // console.log('23232323');
//         queuer([
//           () => console.log('2-3'),
//           async () => {
//             console.log('2-4');
//             await timeout(500);
//             queuer([() => console.log('2-4-1'), () => console.log('2-4-2')]);
//             // await timeout(500);
//             queuer([() => console.log('2-4-3'), () => console.log('2-4-4')]);
//           },
//           () => console.log('2-5')
//         ]);
//       },
//       () => console.log('3'),
//       () => console.log('4'),
//       () => console.log('5'),
//       () => console.log('6')
//     ]);
//   },
//   () => {
//     queuer([
//       () => console.log('7'),
//       () => console.log('8'),
//       () => console.log('9'),
//       () => console.log('10'),
//       () => console.log('11'),
//       () => console.log('12')
//     ]);
//   },
//   () => {
//     queuer([
//       () => console.log('13'),
//       () => console.log('14'),
//       () => console.log('15'),
//       () => console.log('16'),
//       () => console.log('17'),
//       () => console.log('18')
//     ]);
//   }
// ]);
// import { stacktrace } from './stacktrace.mjs';
// let QUEUE = {};
// const queuerCycle = queue => {
//   const keys = Object.keys(queue);
//   // console.log(keys);
//   let fn, data;
//   // let i = 0;
//   for (let i = 0; i < keys.length; i++) {
//     fn = queue[keys[i]];
//     // console.log(fn);
//     if (Array.isArray(fn)) {
//       if (Object.keys(fn).length) queuerCycle(fn);
//       else delete queue[keys[i]], i = i - 1;
//       continue;
//     }
//     data = fn.isData;
//     if (fn.isRun) continue;
//     fn.isRun = true;
//     data = fn(data);
//     if (data instanceof Promise) {
//       return data
//         .then(data => (fn.isData = data))
//         .finally(() => queuerCycle(QUEUE));
//     } else return queuerCycle(QUEUE);
//   }
//   QUEUE = {};
// };
// const createPath = arr => {
//   const res = QUEUE;
//   let obj = res;
//   for (const key of arr) {
//     if (!obj[key]) obj[key] = [];
//     obj = obj[key];
//   }
//   return obj;
// };
// let currentFn = () => [];
// export function queuer(callbacks, data) {
//   const run = !Object.keys(QUEUE).length;
//   const stack = stacktrace(1);
//   // console.log(stack);
//   const path = createPath(stack);
//   console.log(QUEUE);
//   if (!path['999callbacks']) path['999callbacks'] = [];
//   if (!callbacks) callbacks = [];
//   const queue = [];
//   [() => {}, ...callbacks].forEach(fn => {
//     const FN = () => {
//       currentFn = FN;
//       const res = fn();
//       // currentFn = queue[queue.length - 1];
//       return res;
//     };
//     queue.push(FN);
//   });
//   queue[0].isRun = true;
//   queue[0].isData = data;
//   // path['000callbacks']
//   // .splice(path['000callbacks'].indexOf(currentFn), 0, ...queue);
//   path['999callbacks'].push(...queue);
//   if (run) queuerCycle(QUEUE);
//   // return _queuer;
// }

const queuerCycle = queue => {
  let fn, res;

  for (let i = 0; i < queue.length; i++) {
    fn = queue[i];
    if (fn.isRun) continue;
    fn.isRun = true, res = fn(fn.isRes);
    if (res instanceof Promise) return res.finally(() => queuerCycle(queue));
  }

  queue.length = 0;
};

export function Queuer(...args) {
  const QUEUE = [];

  let currentFn = () => {};

  function queuer(...args) {
    let data, callbacks;
    if (arguments.length === 1) data = undefined, callbacks = args[0];else [data, callbacks] = args;

    if (Array.isArray(callbacks) && callbacks.length) {
      const run = !QUEUE.length;
      const queue = [];
      [() => data, ...callbacks].forEach((_fn, k) => {
        const fn = typeof _fn !== 'function' ? () => _fn : _fn;

        const FN = data => {
          currentFn = FN;
          const res = fn(data);

          if (queue[k + 1]) {
            if (!(res instanceof Promise)) {
              if (queue[k + 1]) queue[k + 1].isRes = res;
            } else res.then(res => queue[k + 1] && (queue[k + 1].isRes = res));
          }

          return res;
        };

        queue.push(FN);
      });
      queue[0].isRun = true, queue[1].isRes = data;
      QUEUE.splice(QUEUE.indexOf(currentFn), 0, ...queue);
      if (run) queuerCycle(QUEUE);
    }

    return queuer;
  }

  return queuer(...args);
}
export const queuer = Queuer(); // const queuerCycle = queue => {
//   let fn, res;
//   for (let i = 0; i < queue.length; i++) {
//     fn = queue[i];
//     if (fn.isRun) continue;
//     (fn.isRun = true), (res = fn(fn.isRes));
//     if (res instanceof Promise) return res.finally(() => queuerCycle(queue));
//   }
//   queue.length = 0;
// };
// export function Queuer(isParallel, callbacks, data) {
//   const QUEUE = [];
//   let currentFn = () => {};
//   function queuer(isParallel, callbacks, data) {
//     if (Array.isArray(isParallel)) {
//       data = callbacks;
//       callbacks = isParallel;
//       isParallel = false;
//     }
//     if (Array.isArray(callbacks) && callbacks.length) {
//       const run = !QUEUE.length;
//       const queue = [];
//       [() => data, ...callbacks].forEach((_fn, k) => {
//         const fn = typeof _fn !== 'function' ? () => _fn : _fn;
//         const FN = data => {
//           currentFn = FN;
//           const res = fn(data);
//           if (queue[k + 1]) {
//             if (!(res instanceof Promise)) {
//               if (queue[k + 1]) queue[k + 1].isRes = res;
//             } else res.then(res => queue[k + 1] && (queue[k + 1].isRes = res));
//           }
//           return res;
//         };
//         queue.push(FN);
//       });
//       (queue[0].isRun = true), (queue[1].isRes = data);
//       QUEUE.splice(QUEUE.indexOf(currentFn), 0, ...queue);
//       if (run) queuerCycle(QUEUE);
//       else if (isParallel) queuerCycle(queue);
//     }
//     return queuer;
//   }
//   return queuer(isParallel, callbacks, data);
// }
// export const queuer = Queuer();
// const QUEUE = [];
// const queuerCycle = queue => {
//   let data;
//   while (queue.length) {
//     data = queue.shift()(data);
//     if (data instanceof Promise) {
//       // if (queue !== QUEUE) QUEUE.unshift(...queue);
//       return data
//         .then(data => queuerCycle(queue, data))
//         .catch(err => queuerCycle(queue, err));
//     }
//   }
// };
// console.log(1122);
// export const queuer = callbacks => {
//   // console.log('AAA');
//   const run = !QUEUE.length;
//   if (callbacks && callbacks.length) {
//     // LASTS.unshift(...QUEUE), QUEUE.length = 0;
//     QUEUE.unshift(() => QUEUE.unshift(...callbacks));
//   }
//   if (run) queuerCycle(QUEUE);
//   return queuer;
// };
// export const queuer = async (callbacks, data) => {
//   let isPromise;
//   while (callbacks.length) {
//     data = callbacks.shift()(data);
//     if (data instanceof Promise) {
//       // QUEUE.push(data);
//       // data.finally(() => QUEUE.splice(QUEUE.indexOf(data), 1));
//       isPromise = true;
//       break;
//     }
//   }
//   if (isPromise) {
//     // const data = await STOP;
//     return await queuer(callbacks, await data);
//   }
//   return queuer;
// };
// const QUEUE = [];
// const queuerCycle = queue => {
//   let data;
//   while (queue.length) {
//     data = queue.shift()(data);
//     if (data instanceof Promise) {
//       if (queue !== QUEUE) QUEUE.unshift(...queue);
//       return data
//         .then(data => queuerCycle(QUEUE, data))
//         .catch(err => queuerCycle(QUEUE, err));
//     }
//   }
// };
// console.log(1122);
// export const queuer = callbacks => {
//   console.log('AAA');
//   const run = !QUEUE.length;
//   if (callbacks && callbacks.length) {
//     // LASTS.unshift(...QUEUE), QUEUE.length = 0;
//     QUEUE.unshift(() => queuerCycle(callbacks));
//   }
//   if (run) queuerCycle(QUEUE);
//   return queuer;
// };