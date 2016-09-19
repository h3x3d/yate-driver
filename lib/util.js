'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUOTE_CHAR = undefined;
exports.b2s = b2s;
exports.s2b = s2b;
exports.escape = escape;
exports.unescape = unescape;
exports.randId = randId;

var _crypto = require('crypto');

const QUOTE_CHAR = exports.QUOTE_CHAR = '%';

function b2s(b) {
  return b ? 'true' : 'false';
}

function s2b(s) {
  return s === 'true';
}

function escape(str, extra) {
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

    if (chrCode < 32 || chr === ':' || chr === extra) {
      res += QUOTE_CHAR + String.fromCharCode(chrCode + 64);
    } else if (chr === QUOTE_CHAR) {
      res += QUOTE_CHAR + QUOTE_CHAR;
    } else {
      res += chr;
    }
  }

  return res;
}

function unescape(str) {
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

function randId() {
  return (0, _crypto.randomBytes)(32).toString('hex');
}
//# sourceMappingURL=util.js.map