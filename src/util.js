export const QUOTE_CHAR = '%';

export function b2s(b) {
  return b ? 'true' : 'false';
}

export function s2b(s) {
  return s === 'true';
}

export function escape(str, extra) {
  if (str === undefined) {
    return 'undefined';
  }

  if (typeof str === 'boolean') {
    return b2s(str);
  }

  str = str.toString();
  let res = '';
  for (let idx = 0; idx < str.length; idx++) {
    const chr = str.charAt(idx);
    const chrCode = chr.charCodeAt(0);

    if ((chrCode < 32) || (chr === ':') || (chr === extra)) {
      res += QUOTE_CHAR + String.fromCharCode(chrCode + 64);
    } else if (chr === QUOTE_CHAR) {
      res += QUOTE_CHAR + QUOTE_CHAR;
    } else {
      res += chr;
    }
  }

  return res;
}

export function unescape(str) {
  let res = '';

  if (str === 'true' || str === 'false') {
    return s2b(str);
  }

  for (let idx = 0; idx < str.length; idx++) {
    const chr = str.charAt(idx);
    if (chr === QUOTE_CHAR) {
      const nextChr = str.charAt(++idx);
      if (nextChr === QUOTE_CHAR) {
        res += chr;
      } else {
        res += String.fromCharCode(nextChr.charCodeAt(0) - 64);
      }
    } else {
      res += chr;
    }
  }

  return res;
}
