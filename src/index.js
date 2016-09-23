import Connection from './connection';
import { randId } from './util';
import { Message, makeKey, response } from './message';

export default function YateDriver(connOpts, { role = 'global', id, type } = {}, onMessage, log) {
  const messages = new Map();
  const connection = Connection(connOpts, handler, log);
  connection.send(new Message('%%>connect', role, id, type));

  function dispatchMessage(msg) {
    return new Promise((res, rej) => {
      const key = makeKey(msg);

      connection.send(msg);

      if (key) {
        messages.set(key, [res, rej]);
      } else {
        res(true);
      }
    });
  }

  function setLocal(name, value = '') {
    const msg = new Message('%%>setlocal', name, value);
    return dispatchMessage(msg);
  }

  function output(str) {
    const msg = new Message('%%>output', str);
    return dispatchMessage(msg);
  }

  function install(name, prio = 50, filterName, filterVal) {
    const msg = new Message('%%>install', prio, name, filterName, filterVal);
    return dispatchMessage(msg);
  }

  function uninstall(name) {
    return dispatchMessage(new Message('%%>uninstall', name));
  }

  function message(name, retval, params = {}) {
    const msg = new Message('%%>message', randId(), Math.ceil(Date.now() / 1000), name, params);
    return dispatchMessage(msg);
  }

  function watch(name) {
    return dispatchMessage(new Message('%%>watch', name));
  }

  function unwatch(name) {
    return dispatchMessage(new Message('%%>unwatch', name));
  }

  function handler(msg) {
    const key = makeKey(msg);
    if (key) {
      const cb = messages.get(key);
      if (cb) {
        cb[0](msg);
      } else {
        onMessage(msg)
          .then(connection.send)
          .catch(e => {
            log.error('E', e);
            output(e.message);
            connection.send(response(msg, false));
          });
      }
    } else {
      log.warn('UnhandledMsg', msg);
    }
  }

  return { setLocal, output, message, install, uninstall, watch, unwatch };
}

export { response } from './message';
