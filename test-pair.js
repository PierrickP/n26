const fs = require('fs');
const readline = require('readline');

const Promise = require('bluebird');

const N26 = require('./');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const email = '';
const password = '';

new N26(email, password)
  .then(pair)
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });

function pair(n26) {
  return n26.pairInit()
    .then(() => {
      console.log('pair init');

      return new Promise((resolve, reject) => {
        rl.question('token received by sms for pair: ', smsNumber => {
          rl.close();

          return n26.pairConfirm(smsNumber)
            .then(keys => {
              fs.writeFileSync(`${__dirname}/publicKey.der`, keys.publicKey);
              fs.writeFileSync(`${__dirname}/privateKey.der`, keys.privateKey);
              console.log(`\tDevice paired ${keys.pkp}`);

              resolve();
            })
            .catch(reject);
        });
      });
    });
}
