'use strict';
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

describe('Pair', () => {
  if (global.CONFIG.options.indexOf('Pair') === -1) {
    xit('should pair');
  } else {
    it('should pair', function (cb) { // eslint-disable-line func-names
      this.timeout(60000);

      return global.n26.pairInit()
        .then(() => {
          return rl.question('token received by sms for pair: ', smsNumber => {
            rl.close();

            return global.n26.pairConfirm(smsNumber)
              .then(keys => {
                fs.writeFileSync(`${__dirname}/publicKey.der`, keys.publicKey);
                fs.writeFileSync(`${__dirname}/privateKey.der`, keys.privateKey);
                console.log(`\tDevice paired ${keys.pkp}`);
                cb();
              })
              .catch(cb);
          });
        })
        .catch(cb);
    });
  }
});
