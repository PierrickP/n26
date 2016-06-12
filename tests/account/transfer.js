'use strict';
/* eslint-disable global-require, max-len, arrow-body-style */
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

chai.use(dirtyChai);

let n26;
const data = require('../fixtures/data');

beforeEach((done) => {
  require('../fixtures/auth')((err, m) => {
    n26 = m;

    done();
  });
});

describe('transfer', () => {
  describe('Success', () => {
    let api;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .post('/api/transactions', {
          pin: '1234',
          transaction: {
            partnerBic: 'RBOSNL2A',
            amount: 100,
            type: 'DT',
            partnerIban: 'NL42RBOS0608611611',
            partnerName: 'George Loutre',
            referenceText: 'Gift'
          }
        })
        .reply(200);
    });

    it('should create transfer', () => n26.transfer({
      pin: 1234,
      iban: 'NL42RBOS0608611611',
      bic: 'RBOSNL2A',
      amount: 100,
      name: 'George Loutre',
      reference: 'Gift'
    }));

    afterEach((done) => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    ['pin', 'iban', 'bic', 'amount', 'name', 'reference'].forEach((param) => {
      it(`should validate transfer - missing '${param}'`, () => {
        const transferData = {
          pin: 1234,
          iban: 'NL42RBOS0608611611',
          bic: 'RBOSNL2A',
          amount: 100,
          name: 'George Loutre',
          reference: 'Gift'
        };

        delete transferData[param];

        return n26.transfer(transferData).catch((err) => {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('MISSING_PARAMS');
        });
      });
    });

    it('should validate transfer - too long `reference`', () => {
      return n26.transfer({
        pin: 1234,
        iban: 'NL42RBOS0608611611',
        bic: 'RBOSNL2A',
        amount: 100,
        name: 'George Loutre',
        reference: require('crypto').randomBytes(256).toString('hex')
      }).catch((err) => {
        expect(err).to.be.an.instanceOf(Error);
        expect(err.message).to.equal('REFERENCE_TOO_LONG');
      });
    });
  });
});
