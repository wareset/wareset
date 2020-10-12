const CACHE_SEPARATORS = {};
const CACHE_QUOTES = {};
const CACHE_BRACKETS = {};

const len = v => (v ? v.length : 0);
const cRe = v => v.source || (v ? `[${v}]` : v);
const getRegSeparator = v => new RegExp(`(${v})`, 'm');
const getRegQuotes = v => new RegExp(`(?:^|\\W)(${v})|(${v})(?=\\W|$)`, 'gm');
const getRegBrackets = v => new RegExp(v, 'gm');

export default function smartsplit(str, s = /\s*(,)\s*/, q1 = '\'"`', q2 = '') {
  s = CACHE_SEPARATORS[s] || (CACHE_SEPARATORS[s] = getRegSeparator(cRe(s)));
  const step = len(str.match(s));
  if (!step) return [str];

  if (q2) {
    q1 = CACHE_BRACKETS[q1] || (CACHE_BRACKETS[q1] = getRegBrackets(cRe(q1)));
    q2 = CACHE_BRACKETS[q2] || (CACHE_BRACKETS[q2] = getRegBrackets(cRe(q2)));
  } else q1 = CACHE_QUOTES[q1] || (CACHE_QUOTES[q1] = getRegQuotes(cRe(q1)));

  const res = [];

  const columnsDirty = str.split(s);

  let isMatch = false;
  let isDeep = 0;
  let isQuote = false;
  let matchSames = 0;
  let column, match1, match2, l1, l2;
  for (let i = 0; i < len(columnsDirty); i += step) {
    (column = columnsDirty[i]), (match1 = column.match(q1)), (l1 = len(match1));

    if (isMatch !== (isMatch === isQuote)) res.push(column);
    else res[len(res) - 1] += columnsDirty[i + 1 - step] + column;

    if (!q2) {
      if (l1 > 1) {
        match1 = match1
          .map(v => v[len(v) - 1])
          .filter((v, k, a) => (isQuote ? v === a[a.length - 1] : v === a[0]));
        l1 = len(match1);
      }
      isMatch = !!(l1 % 2);
      if (isMatch) isQuote = !isQuote;
    } else {
      match2 = column.match(q2);
      isDeep += l1 - (l2 = len(match2));
      if (l1 && l2) matchSames += len(match2.filter(v => ~match1.indexOf(v)));
      if (isDeep < 0) isDeep = -isDeep;
      isMatch = isQuote = !!(isDeep || matchSames % 2);
    }
  }

  return res;
}
