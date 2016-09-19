'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Message = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.serialize = serialize;
exports.parse = parse;
exports.makeKey = makeKey;
exports.response = response;

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RESTPARAMS = '___RESTARGS___';

const FIELDS = {
  '%%>message': ['id', 'time', 'name', 'retvalue', RESTPARAMS],
  '%%<message': ['id', 'processed', 'name', 'retvalue', RESTPARAMS],
  '%%>install': ['prio', 'name', 'filterName', 'filterVal'],
  '%%<install': ['prio', 'name', 'success'],
  '%%>uninstall': ['name'],
  '%%<uninstall': ['prio', 'name', 'success'],
  '%%>watch': ['name'],
  '%%<watch': ['name', 'success'],
  '%%>setlocal': ['name', 'value'],
  '%%>unwatch': ['name'],
  '%%<unwatch': ['name', 'success'],
  '%%<setlocal': ['name', 'value', 'success'],
  '%%>connect': ['role', 'id', 'chanType'],
  '%%>output': ['text'],
  'Error in': ['text']
};

const KEYFIELDS = {
  '%%>message': ['id'],
  '%%<message': ['id'],
  '%%>setlocal': ['name'],
  '%%<setlocal': ['name'],
  '%%>install': ['name', 'prio'],
  '%%<install': ['name', 'prio']
};

class Message {
  constructor(type, ...args) {
    const fields = FIELDS[type];
    let i = 0;
    for (const field of fields) {
      if (field === RESTPARAMS) {
        if (typeof args[i] === 'object') {
          this.params = args[i];
          break;
        }

        this.params = {};
        while (i < args.length) {
          const curArg = args[i++];
          const eqPos = curArg.strpos('=');
          this.params[curArg.substr(0, eqPos)] = curArg.substr(eqPos);
        }
      } else {
        this[field] = args[i++];
      }
    }
    this.type = type;
  }
}

exports.Message = Message;
function serialize(msg) {
  const fields = FIELDS[msg.type];
  const ret = [msg.type];

  for (const field of fields) {
    if (field === RESTPARAMS) {
      for (const param of (0, _keys2.default)(msg.params)) {
        ret.push(`${ (0, _util.escape)(param) }=${ (0, _util.escape)(msg.params[param]) }`);
      }
    } else if (msg[field] === undefined) {
      ret.push('');
    } else {
      ret.push((0, _util.escape)(msg[field]));
    }
  }

  return `${ ret.join(':') }`;
}

function parse(str) {
  const [type, ...args] = str.split(':');
  return new Message(type, ...args.map(_util.unescape));
}

function makeKey(msg) {
  const fields = KEYFIELDS[msg.type];

  if (KEYFIELDS[msg.type] === undefined) {
    return undefined;
  }
  const ret = [msg.type.substr(3)];

  for (const field of fields) {
    ret.push(msg[field]);
  }

  return ret.join(':');
}

function response(orig, processed = true, retval = undefined, params = {}, name = undefined) {
  return new Message('%%<message', orig.id, processed, name === undefined ? orig.name : name, retval === undefined ? orig.retval : retval, params);
}
//# sourceMappingURL=message.js.map