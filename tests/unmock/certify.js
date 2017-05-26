'use strict';
const fs = require('fs');

describe('Certify', () => {
  if (global.CONFIG.options.indexOf('Certify') === -1) {
    xit('should certify transfer');
  } else {
    it('should certify transfer', () => {
      return global.n26.transfer({
        pin: process.env.TRANSFER_PIN,
        iban: process.env.TRANSFER_IBAN,
        bic: process.env.TRANSFER_BIC,
        amount: 0.01,
        name: process.env.TRANSFER_NAME,
        reference: 'Test'
      })
      .then(t => t.id)
      .then(tId => {
        console.log('tID', tId);

        return global.n26.transferCertify(tId, fs.readFileSync(`${__dirname}/privateKey.der`))
        .then(() => {


        });
      });
    });
  }
});
