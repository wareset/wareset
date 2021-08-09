import { isPromise } from '@wareset-utilites/is/isPromise';
import { keys } from '@wareset-utilites/object/keys';
var o = {};
o[11] = 0, o[2] = 0;
var getSortedKeys = 2 == +keys(o)[0] ? keys : e => keys(e).sort((e, t) => +e - +t);

var awaiter = (t, o) => {
  isPromise(t) ? Promise.resolve(t).then(o) : o(t);
};

export { awaiter, getSortedKeys };
