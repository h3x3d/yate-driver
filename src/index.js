import Connection from './connection';
import { escape } from './util';
import { Message } from './message';

const NEED_RESPONSE = ['%%>setlocal'];

export default function YateDriver(connOpts, yateOpts, log) {
  const messages = new Map();
  let connection = Connection(connOpts, handler, log);


  function handler(msg) {

  }

  function setLocal(name, value = '') {
    return new Promise((res, rej) => {
      messages.set(`%%>setlocal:${name}`, [res, rej]);
      connection.send(new Message('%%>setlocal', name, value));
    });
  }

  function output(str) {

  }

  return { setLocal };
}
