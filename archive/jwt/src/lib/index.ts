const [__encodeURIComponent__, __decodeURIComponent__] =
  (() => [encodeURIComponent, decodeURIComponent])()

const BTOA: ((s: string) => string) = typeof btoa !== 'undefined'
  ? btoa : (data: string): string => Buffer.from(data).toString('base64')

const ATOB: ((s: string) => string) = typeof atob !== 'undefined'
  ? atob : (data: string): string => Buffer.from(data, 'base64').toString()

const __btoa__ = (s: string): string => BTOA(__encodeURIComponent__(s)
  .replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(+('0x' + p1))))

const __atob__ = (s: string): string => {
  let res = ''
  for (let a = ATOB(s), i = 0; i < a.length; i++) {
    res += '%' + ('00' + a[i].charCodeAt(0).toString(16)).slice(-2)
  }
  return __decodeURIComponent__(res)
}

const stringify = JSON.stringify
const jsonparse = JSON.parse

const hash = (t: any, complexity: number, numsalt: number): string => {
  t += ''
  complexity = (complexity! |= 0) || 1
  numsalt = isFinite(numsalt = +numsalt!) && numsalt > 0 ? 1 + numsalt : 1

  const a: [number, number][] = []
  let res = '', h: number, i: number, c: number, z: [number, number]
  for (i = 0; i < complexity;) a[i] = [numsalt * ++i, numsalt]
  for (h = t.length; h-- > 0;) {
    c = t.charCodeAt(h)
    for (i = complexity; i-- > 0;) {
      (z = a[i])[1] += (++z[0] + c * ++z[1]) / (c + z[1])
      z[1] *= z[1] < 5 ? 5 : 0.5
    }
  }
  for (i = complexity; i-- > 0;) {
    (z = a[i])[1] > 1 && (z[1] -= z[1] | 0); res += z[1].toString(36).slice(2)
  }
  return res
}

const hashFactory = (
  complexity?: number, numsalt?: number
) => (s: string): string => hash(
  s, complexity! > 0 ? complexity! : 1, numsalt! > 0 ? numsalt! : 1
)

export {
  hashFactory,
  __btoa__ as btoa,
  __atob__ as atob,
  __encodeURIComponent__ as encodeURIComponent,
  __decodeURIComponent__ as decodeURIComponent,
  stringify, jsonparse
}

/*
// https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.unescape.js
const fromCharCode = String.fromCharCode
const hex2 = /^[\da-f]{2}$/i
const hex4 = /^[\da-f]{4}$/i
const unescaper = (str: string): string => {
  // return str
  let result = ''
  const length = str.length
  let index = 0
  let chr, part
  while (index < length) {
    chr = str.charAt(index++)
    if (chr === '%') {
      if (str.charAt(index) === 'u') {
        part = str.slice(index + 1, index + 5)
        if (hex4.test(part)) {
          result += fromCharCode(parseInt(part, 16))
          index += 5
          continue
        }
      } else {
        part = str.slice(index, index + 2)
        if (hex2.test(part)) {
          result += fromCharCode(parseInt(part, 16))
          index += 2
          continue
        }
      }
    }
    result += chr
  } return result
}

// https://github.com/zloirock/core-js/blob/master/packages/core-js/modules/es.escape.js
const raw = /[\w*+\-./@]/
const hex = (code: number, length: number): string => {
  let result = code.toString(16)
  while (result.length < length) result = '0' + result
  return result
}
const escaper = (str: string): string => {
  // return str
  let result = ''
  const length = str.length
  let index = 0
  let chr, code
  while (index < length) {
    chr = str.charAt(index++)
    if (raw.test(chr)) {
      result += chr
    } else {
      code = chr.charCodeAt(0)
      if (code < 256) {
        result += '%' + hex(code, 2)
      } else {
        result += '%u' + hex(code, 4).toUpperCase()
      }
    }
  } return result
}

const utf8_to_b64 = (str: string): string => BTOA(unescaper(encodeURIComponent(str)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]+$/g, '')

const fix = (n: number): number => n !== 4 ? n : 0
const b64_to_utf8 = (str: string): string => decodeURIComponent(escaper(ATOB(
  str.replace(/-/g, '+').replace(/_/g, '/') + repeat('=', fix(4 - str.length % 4))
)))
*/
