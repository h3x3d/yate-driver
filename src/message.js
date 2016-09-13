import { unescape, escape } from './util';

const RESTPARAMS = '___RESTARGS___';

const FIELDS = {
  '%%>message': ['id', 'time', 'name', 'retvalue', RESTPARAMS],
  '%%>setlocal': ['name', 'value'],
  '%%<setlocal': ['name', 'value', 'success'],
  'Error in': ['text']
};

export class Message {
  constructor(type, ...args) {
    const fields = FIELDS[type];
    let i = 0;
    for (const field of fields) {
      if (field === RESTPARAMS) {
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

export function serialize(msg) {
  const fields = FIELDS[msg.type];
  const ret = [msg.type];

  for (const field of fields) {
    if (field === RESTPARAMS) {
      for (const param of Object.keys(msg.params)) {
        ret.push(`${escape(param)}=${escape(msg.params[param])}`);
      }
    } else {
      ret.push(escape(msg[field]));
    }

  }

  return ret.join(':');
}

export function parse(str) {
  const [type, ...args] = str.split(':');
  return new Message(type, args.map(unescape));
}
