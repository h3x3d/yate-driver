# Yate driver for nodejs #

Example:
```javascript
import YateDriver, { response } from 'yate-driver';

const logger = {
  debug: console.log,
  info: console.log,
  warn: console.error,
  error: console.error
};

async function onMessage(msg) {
    logger.info(msg);
    return response(msg, true, true);
}

async function work() {
    const conn = YateDriver({ port: 10500 }, { role: 'global' }, onMessage, logger);
    await conn.setLocal('reenter', true);
    await conn.install('user.register');
}

work().catch(console.error);
```
