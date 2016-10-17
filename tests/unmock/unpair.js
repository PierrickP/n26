'use strict';
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

describe('Unpair', () => {
  if (global.CONFIG.options.indexOf('Unpair') === -1) {
    xit('should unpair phone');
  } else {
    it('should unpair phone', function (cb) { // eslint-disable-line func-names
      this.timeout(60000);

      return global.n26.unpairInit(global.CONFIG.pin, global.CONFIG.cardNumber)
        .then(() => {
          return rl.question('token received by sms: ', smsNumber => {
            rl.close();

            return global.n26.unpairConfirm(smsNumber)
              .then(() => {
                console.log('\tDevice unpaired');
                cb();
              })
              .catch(cb);
          });
        })
        .catch(cb);
    });
  }
});
