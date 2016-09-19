import { connect } from 'net';
import { createInterface } from 'readline';
import { serialize, parse } from './message';

export default function Connection(connOpts, handler, log) {
  const conn = connect(connOpts);
  const readline = createInterface({ input: conn, output: conn });

  function onMessage(str) {
    const msg = parse(str);
    log.debug('>', msg);
    handler(msg);
  }

  conn.on('connect', () => {
    log.debug('Yate connected');
  });

  conn.on('error', (e) => {
    log.error('Yate connection error', e);
  });

  conn.on('close', () => {
    log.debug('Yate connection closed');
  });

  readline.on('line', onMessage);

  function close() {
    conn.end();
  }

  function send(msg) {
    log.debug('<', msg);
    conn.write(`${serialize(msg)}\n`);
  }

  return { close, send };
}
