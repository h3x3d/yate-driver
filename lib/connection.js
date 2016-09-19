'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Connection;

var _net = require('net');

var _readline = require('readline');

var _message = require('./message');

function Connection(connOpts, handler, log) {
  const conn = (0, _net.connect)(connOpts);
  const readline = (0, _readline.createInterface)({ input: conn, output: conn });

  function onMessage(str) {
    const msg = (0, _message.parse)(str);
    log.debug('>', msg);
    handler(msg);
  }

  conn.on('connect', () => {
    log.debug('Yate connected');
  });

  conn.on('error', e => {
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
    conn.write(`${ (0, _message.serialize)(msg) }\n`);
  }

  return { close, send };
}
//# sourceMappingURL=connection.js.map