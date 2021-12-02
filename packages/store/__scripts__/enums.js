const { jsonStringify } = require('@wareset-utilites/lang/jsonStringify')
const { includes } = require('@wareset-utilites/array/includes')

const isDev = includes([...process.execArgv, ...process.argv], '--dev')

if (isDev) {
  console.clear()
  setTimeout(() => {
    console.log('Inspect close')
  }, 1000 * 60 * 60)
}

const { resolve: pathResolve } = require('path')
const {
  watchFile: fsWatchFile,
  readFileSync: fsReadFileSync,
  writeFileSync: fsWriteFileSync
} = require('fs')

const {
  TOKEN_SPACE,
  TOKEN_PUCNTUATOR
} = require('rastree/core/template/lib/source2Tokens')
const { source2Tokens } = require('rastree/core/template/lib/source2Tokens')
const { trimTokens } = require('rastree/core/template/lib/trimTokens')
// prettier-ignore
const { stringifyTokens } = require('rastree/core/template/lib/stringifyTokens')
const { enumChars } = require('enum-chars')

const DIR_SRC_CORE = pathResolve(__dirname, '../src/__src__')
const FILE_ENUMS_DEV = pathResolve(DIR_SRC_CORE, 'enums.ts')
const FILE_ENUMS = pathResolve(DIR_SRC_CORE, 'enums__AUTOGEN.ts')

let word = ''

// if (!isDev) {
//   fsWriteFileSync(FILE_ENUMS, fsReadFileSync(FILE_ENUMS_DEV).toString())
// } else {
const initChange = () => {
  const source = fsReadFileSync(FILE_ENUMS_DEV).toString()

  const tokens = source2Tokens(source).tokens

  let cur = []
  let arr = [cur]

  let i = -1
  let token
  let lastDeep = 0
  while (token = tokens[++i]) {
    cur.push(token)
    if (!token.deep && lastDeep !== token.deep) arr.push(cur = [])
    lastDeep = token.deep
  }
  arr = arr.map((v) => trimTokens(v)).filter((v) => v[0])

  arr.forEach((tokens) => {
    if (
      tokens[2] &&
      tokens[4] &&
      tokens[2].value === 'const' &&
      tokens[4].value === 'enum'
    ) {
      word = ''
      const ename = tokens[6].value
      tokens.forEach((token) => {
        const type = token.type
        if (token.deep && type !== TOKEN_SPACE && type !== TOKEN_PUCNTUATOR) {
          if (isDev) {
            token.value += ' = ' + jsonStringify(ename + '_' + token.value)
          } else {
            word = enumChars.letters(word)
            token.value += ' = ' + jsonStringify(word)
          }
        }

        // console.log(token.value)
      })
    }
  })

  const res = arr.map((v) => stringifyTokens(v)).join('\n\n') + '\n'
  fsWriteFileSync(FILE_ENUMS, res)
}
initChange()

if (isDev) fsWatchFile(FILE_ENUMS_DEV, { interval: 250 }, initChange)
// }
