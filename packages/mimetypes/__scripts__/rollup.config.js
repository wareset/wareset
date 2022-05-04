import babel from '@rollup/plugin-babel'
// import babelrc from './.babelrc.js'
import resolve from '@rollup/plugin-node-resolve'
import { minify } from 'terser'

const terser = {
  async renderChunk(code) {
    return await minify(code, { safari10: true })
  }
}

const babelrc = (ie) => ({
  babelHelpers: 'bundled',
  // babelrc: false,
  presets     : [
    [
      '@babel/preset-env',
      {
        corejs     : 3,
        loose      : true,
        bugfixes   : true,
        modules    : false,
        useBuiltIns: 'entry', // 'entry', 'usage'
        targets    : '> 1%, not dead' + (ie ? ', ie ' + +ie : '')
      }
    ]
  ]
})

const bundle = (min, ie) => ({
  input : 'index.mjs',
  output: [
    {
      format: ie ? 'iife' : 'umd',
      name  : 'mimetypes',
      file  : `dist/mimetypes${ie ? '.ie' : ''}${min ? '.min' : ''}.js`
    }
  ],
  plugins: [
    resolve({ browser: true }),
    babel(babelrc(ie)),
    min && terser,
    {
      renderChunk(code) {
        return `/* eslint-disable */
/**
 * @license
 * Copyright 2020-2022 @wareset/store Authors
 * SPDX-License-Identifier: MIT
 */
${code}`
      }
    }
  ]
})

export default [
  bundle(false, false),
  bundle(true, false),
  bundle(false, 9),
  bundle(true, 9)
]
