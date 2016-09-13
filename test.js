import Driver from './src';
// import { escape } from './src/util.js';

const log = {
  debug: console.log,
  error: console.error,
  info: console.log
};



// conn.send('%%>connect:global');
// conn.send('%%>setlocal:reenter:true');
// conn.send('%%>setlocal:trackparam:nodeyate');
// conn.send('%%>output:test');


async function work() {
  const conn = Driver({ port: 10500 }, {}, log);
  const res = await conn.setLocal('reenter', true);
  log.info(res);
}

work().catch(e => console.error(e.stack));
