const app = require('./app');
const express_req = require('express/lib/request');
const express = [];
Object.keys(express_req).forEach((v) => {
  const prop = Object.getOwnPropertyDescriptor(express_req, v);
  if (typeof prop.value === 'function') express.push([v, prop.value]);
});

function __fix_req(req) {
  req.originalUrl = req.originalUrl || req.url;
  req.baseUrl = req.baseUrl || '';

  req.app = app;
  for (const v of express) req[v[0]] = v[1].bind(req);
}

module.exports = { __fix_req };
