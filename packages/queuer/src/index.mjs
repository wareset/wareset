const queuerCycle = queue => {
  let fn, res;
  for (let i = 0; i < queue.length; i++) {
    fn = queue[i];
    if (fn.isRun) continue;
    (fn.isRun = true), (res = fn(fn.isRes));
    if (res instanceof Promise) return res.finally(() => queuerCycle(queue));
  }
  queue.length = 0;
};

export function Queuer(...args) {
  const QUEUE = [];
  let currentFn = () => {};
  function queuer(...args) {
    let data, callbacks;
    if (arguments.length === 1) (data = undefined), (callbacks = args[0]);
    else [data, callbacks] = args;

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
      (queue[0].isRun = true), (queue[1].isRes = data);
      QUEUE.splice(QUEUE.indexOf(currentFn), 0, ...queue);
      if (run) queuerCycle(QUEUE);
    }
    return queuer;
  }

  return queuer(...args);
}

export const queuer = Queuer();
