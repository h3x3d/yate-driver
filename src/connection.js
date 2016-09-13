import { connect } from 'net';
import { createInterface } from 'readline';
import EventEmitter from 'events';
import { parse } from './message';

export default function Connection(connOpts, handler, log) {
  const conn = connect(connOpts);
  const readline = createInterface({ input: conn, output: conn });

  conn.on('connect', () => {
    log.debug('Yate connected');
  });

  conn.on('error', (e) => {
    log.error('Yate connection error', e);
  });

  conn.on('close', () => {
    log.debug('Yate connection closed');
  });

  readline.on('line', str => handler(parse(str)));

  function close() {
    conn.end();
  }

  function send(str) {
    conn.write(str + `\n`);
  }

  return { close, send };
}
