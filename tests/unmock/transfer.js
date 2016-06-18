'use strict';
/* eslint-disable global-require, max-len, no-console, arrow-body-style */

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

chai.use(dirtyChai);

describe('Transfer', () => {
  if (global.CONFIG.options.indexOf('Transfer') === -1) {
    xit('should transfer money out');
  } else {
    it('should transfer money out', () => {
      return global.n26.transfer({
        pin: global.CONFIG.pin,
        iban: global.CONFIG.transferIBAN,
        bic: global.CONFIG.transferBIC,
        amount: 0.01,
        name: global.CONFIG.transferNAME,
        reference: 'Test'
      })
      .then((t) => {
        expect(t).to.have.property('n26Iban');
        expect(t).to.have.property('referenceText', 'Test');
        expect(t).to.have.property('partnerName');
        expect(t).to.have.property('partnerIban');
        expect(t).to.have.property('partnerBic');
        expect(t).to.have.property('partnerAccountIsSepa');
        expect(t).to.have.property('amount');
        expect(t).to.have.deep.property('currencyCode.currencyCode');
        expect(t).to.have.property('linkId');
        expect(t).to.have.property('recurring', false);
        expect(t).to.have.property('type', 'DT');
        expect(t).to.have.property('visibleTS');
        expect(t).to.have.property('id');

        console.log(`\tTransfer: ${t.partnerName} ${t.amount} ${t.partnerBic}`);
      });
    });
  }
});
