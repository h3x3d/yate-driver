'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.response = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

exports.default = YateDriver;

var _message = require('./message');

Object.defineProperty(exports, 'response', {
  enumerable: true,
  get: function () {
    return _message.response;
  }
});

var _connection = require('./connection');

var _connection2 = _interopRequireDefault(_connection);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YateDriver(connOpts, { role = 'global', id, type } = {}, onMessage, log) {
  const messages = new _map2.default();
  const connection = (0, _connection2.default)(connOpts, handler, log);
  connection.send(new _message.Message('%%>connect', role, id, type));

  function dispatchMessage(msg) {
    return new _promise2.default((res, rej) => {
      const key = (0, _message.makeKey)(msg);

      connection.send(msg);

      if (key) {
        messages.set(key, [res, rej]);
      } else {
        res(true);
      }
    });
  }

  function setLocal(name, value = '') {
    const msg = new _message.Message('%%>setlocal', name, value);
    return dispatchMessage(msg);
  }

  function output(str) {
    const msg = new _message.Message('%%>output', str);
    return dispatchMessage(msg);
  }

  function install(name, prio = 50, filterName, filterVal) {
    const msg = new _message.Message('%%>install', prio, name, filterName, filterVal);
    return dispatchMessage(msg);
  }

  function uninstall(name) {
    return dispatchMessage(new _message.Message('%%>uninstall', name));
  }

  function message(name, retval, params = {}) {
    const msg = new _message.Message('%%>message', (0, _util.randId)(), Math.ceil(Date.now() / 1000), name, params);
    return dispatchMessage(msg);
  }

  function watch(name) {
    return dispatchMessage(new _message.Message('%%>watch', name));
  }

  function unwatch(name) {
    return dispatchMessage(new _message.Message('%%>unwatch', name));
  }

  function handler(msg) {
    const key = (0, _message.makeKey)(msg);
    if (key) {
      const cb = messages.get(key);
      if (cb) {
        cb[0](msg);
      } else {
        onMessage(msg).then(connection.send).catch(e => {
          log.error('E', e);
          output(e.message);
          connection.send((0, _message.response)(msg, false));
        });
      }
    } else {
      log.warn('UnhandledMsg', msg);
    }
  }

  return { setLocal, output, message, install, uninstall, watch, unwatch };
}
//# sourceMappingURL=index.js.map