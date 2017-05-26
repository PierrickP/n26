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

const pin = '';
const iban = '';
const bic = '';
const name = '';

new N26(email, password)
  .then(certify)
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });

function certify(n26) {
  return n26.transfer({
    pin,
    iban,
    bic,
    amount: 1,
    name,
    reference: 'Test'
  })
  .then(t => t.id)
  .then(tId => {
    console.log('tID', tId);

    return n26.transferCertify(tId, fs.readFileSync(`${__dirname}/privateKey.der`))
    .then(console.log)
    .then(console.error);
  });
}

