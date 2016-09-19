import { unescape, escape } from './util';

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
  '%%<install': ['name', 'prio'],
  '%%>watch': ['name'],
  '%%<unwatch': ['name']
};


export class Message {
  constructor(type, ...args) {
    const fields = FIELDS[type];
    let i = 0;
    for (const field of fields) {
      if (field === RESTPARAMS) {
        if (typeof args[i] !== 'string') {
          this.params = args[i];
          break;
        }

        this.params = {};
        while (i < args.length) {
          const curArg = args[i++];
          const eqPos = curArg.indexOf('=');
          this.params[curArg.substr(0, eqPos)] = curArg.substr(eqPos + 1);
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
    } else if (msg[field] === undefined) {
      ret.push('');
    } else {
      ret.push(escape(msg[field]));
    }
  }

  return `${ret.join(':')}`;
}

export function parse(str) {
  const [type, ...args] = str.split(':');
  return new Message(type, ...args.map(unescape));
}

export function makeKey(msg) {
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

export function response(orig, processed = true, retval = undefined, params = {}, name = undefined) {
  return new Message(
    '%%<message',
    orig.id,
    processed,
    name === undefined ? orig.name : name,
    retval === undefined ? orig.retval : retval,
    params
  );
}
