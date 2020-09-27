const { inArr } = require('@wareset/utilites');
const { EVENTERS, LISTEN } = require('./lib/consts');
// const store = require('@wareset/store');


class WaresetEventer {
  constructor(target) {
    this.mount = () => {
      this.destroy = LISTEN.subscribe(() => {
        if (!inArr(EVENTERS, target)) EVENTERS.push(target, this);

        return () => {
          const index = EVENTERS.indexOf(target) + 1;
          if (index) EVENTERS.splice(index - 1, 2);
        };
      });
    };
    this.mount();
  }
}

function __Eventer(target) {
  const index = EVENTERS.indexOf(target) + 1;
  return index ? EVENTERS[index] : new WaresetEventer(target);
}

module.exports = __Eventer;
