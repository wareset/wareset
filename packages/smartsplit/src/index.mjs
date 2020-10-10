const CACHE_REG_DELIMS = {};
const CACHE_REG_QUOTES = {};

const getRegDelims = d => new RegExp(`[^\\S${d}]*[${d}][^\\S${d}]*`, 'g');
const getRegQuotes = q => new RegExp(`(?:^|\\W)[${q}]|[${q}](?=\\W|$)`, 'g');

export default function smartsplit(str, d = ',', q = '\'"`') {
  const dReg = CACHE_REG_DELIMS[d] || (CACHE_REG_DELIMS[d] = getRegDelims(d));
  const qReg = CACHE_REG_QUOTES[q] || (CACHE_REG_QUOTES[q] = getRegQuotes(q));

  const delimeters = [];
  str.replace(dReg, d => delimeters.push(d));
  const columnsDirty = str.split(dReg);

  const res = [];

  let isQuote = false;
  let isMatch, column, match;
  for (let i = 0; i < columnsDirty.length; i++) {
    column = columnsDirty[i];
    match = column.match(qReg) || [];
    if (match.length > 1) {
      match = match
        .map(v => v[v.length - 1])
        .filter((v, k, a) => (isQuote ? v === a[a.length - 1] : v === a[0]));
    }
    isMatch = !!(match.length % 2);
    if (isMatch !== (isMatch === isQuote)) res.push(column);
    else res[res.length - 1] += delimeters[i - 1] + column;
    if (isMatch) isQuote = !isQuote;
  }

  return res;
}
