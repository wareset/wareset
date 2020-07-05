// const { v4: uuidv4 } = require('uuid');

const app = require('./app');
const express_res = require('express/lib/response');
const express = [];
Object.keys(express_res).forEach((v) => {
  if (v === 'render') return;
  const prop = Object.getOwnPropertyDescriptor(express_res, v);
  if (typeof prop.value === 'function') express.push([v, prop.value]);
});

function __fix_res(res) {
  // https://github.com/sveltejs/sapper/blob/master/runtime/src/server/middleware/index.ts
  // if (!res['locals']) res['locals'] = {};
  // if (!res['locals'].nonce) res['locals'].nonce = uuidv4();

  res.app = app;
  for (const v of express) res[v[0]] = v[1].bind(res);
}

module.exports = { __fix_res };
