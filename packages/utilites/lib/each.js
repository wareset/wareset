export default function each(data, cb) {
  let keys;
  let i;
  switch (Object.getPrototypeOf(data).constructor) {
    case Object:
      keys = Object.keys(data);
      for (let k = -1; ++k < keys.length; undefined) {
        cb(data[keys[k]], keys[k], data);
      }
      break;

    case Array:
      for (let k = -1; ++k < data.length; undefined) {
        cb(data[k], k, data);
      }
      break;

    case Map:
    case WeakMap:
      for (const [k, v] of data) {
        cb(v, k, data);
      }
      break;

    case Set:
    case WeakSet:
      i = 0;
      for (const v of data) {
        cb(v, i, data);
        i++;
      }
      break;

    default:
      throw new Error(data);
  }
};
