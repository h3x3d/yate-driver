import { connect } from 'net';

function Client({ port, host }, log) {
  const conn = connect(opts);

  conn.on('connect', () => {
    log.debug('Yate connected');
  });

  conn.on('error', e => {
    log.error('Yate connection error', e);
  });

  conn.on('close', () => {
    log.debug('Yate connection closed');
  });

  function stop() {
    conn.end();
  }

  return { stop };
}
//# sourceMappingURL=index.js.map