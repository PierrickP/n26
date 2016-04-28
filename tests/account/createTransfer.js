'use strict';
/* eslint-disable global-require */
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

describe('createTransfer', () => {
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
        }).reply(200);
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
    it('should return error', (done) => {
      nock('https://api.tech26.de')
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
        .reply(500, {error: 'ERROR'});

      n26.transfer({
        pin: 1234,
        iban: 'NL42RBOS0608611611',
        bic: 'RBOSNL2A',
        amount: 100,
        name: 'George Loutre',
        reference: 'Gift'
      }, (err) => {
        expect(err).to.be.eql({error: 'ERROR'});

        done();
      });
    });

    it('should return only status code', (done) => {
      nock('https://api.tech26.de')
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
        }).reply(500);

      n26.transfer({
        pin: 1234,
        iban: 'NL42RBOS0608611611',
        bic: 'RBOSNL2A',
        amount: 100,
        name: 'George Loutre',
        reference: 'Gift'
      }, (err) => {
        expect(err).to.be.equal(500);

        done();
      });
    });

    ['pin', 'iban', 'bic', 'amount', 'name', 'reference'].forEach((param) => {
      it(`should validate transfer - missing '${param}'`, (done) => {
        const transferData = {
          pin: 1234,
          iban: 'NL42RBOS0608611611',
          bic: 'RBOSNL2A',
          amount: 100,
          name: 'George Loutre',
          reference: 'Gift'
        };

        delete transferData[param];

        n26.transfer(transferData, (err) => {
          expect(err).to.be.equal('MISSING_PARAMS');

          done();
        });
      });
    });

    it('should validate transfer - too long `reference`', (done) => {
      n26.transfer({
        pin: 1234,
        iban: 'NL42RBOS0608611611',
        bic: 'RBOSNL2A',
        amount: 100,
        name: 'George Loutre',
        reference: require('crypto').randomBytes(256).toString('hex')
      }, (err) => {
        expect(err).to.be.equal('REFERENCE_TOO_LONG');

        done();
      });
    });
  });
});
