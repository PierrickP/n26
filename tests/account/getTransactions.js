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

describe('getTransactions', () => {
  describe('Success', () => {
    let api;

    it('should return transactions', (done) => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/smrt/transactions')
        .query({limit: 50})
        .reply(200, [{
          id: 'bbd24eb7-925a-48dd-9c1e-75bb9f514d78',
          type: 'AA',
          smartLinkId: '1125318169-598002',
          amount: -21.79,
          currencyCode: 'EUR',
          originalAmount: -21.79,
          originalCurrency: 'EUR',
          exchangeRate: 1.0,
          merchantCity: 'PARIS        ',
          visibleTS: 1455292872000,
          mcc: 5977,
          mccGroup: 4,
          merchantName: 'PANDORA CORP          ',
          merchantId: '6260861        ',
          recurring: false,
          userId: '93c3e18b-830a-4758-bb96-ef4d1d859fc3',
          linkId: '1125318169-598002',
          accountId: 'efe2cc9a-49da-4eea-bfa0-236eac673a8a',
          category: 'micro-shopping',
          cardId: '9d1e122f-76ea-4222-a059-a92348a40ac2',
          pending: false,
          transactionNature: 'NORMAL'
        }]);

      n26.transactions({}, (err, me) => {
        expect(err).to.be.null();

        expect(me).to.be.eql([{
          id: 'bbd24eb7-925a-48dd-9c1e-75bb9f514d78',
          type: 'AA',
          smartLinkId: '1125318169-598002',
          amount: -21.79,
          currencyCode: 'EUR',
          originalAmount: -21.79,
          originalCurrency: 'EUR',
          exchangeRate: 1.0,
          merchantCity: 'PARIS        ',
          visibleTS: 1455292872000,
          mcc: 5977,
          mccGroup: 4,
          merchantName: 'PANDORA CORP          ',
          merchantId: '6260861        ',
          recurring: false,
          userId: '93c3e18b-830a-4758-bb96-ef4d1d859fc3',
          linkId: '1125318169-598002',
          accountId: 'efe2cc9a-49da-4eea-bfa0-236eac673a8a',
          category: 'micro-shopping',
          cardId: '9d1e122f-76ea-4222-a059-a92348a40ac2',
          pending: false,
          transactionNature: 'NORMAL'
        }]);

        done();
      });
    });

    it('should limit result', (done) => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/smrt/transactions')
        .query({limit: 20})
        .reply(200, [{
          id: 'bbd24eb7-925a-48dd-9c1e-75bb9f514d78',
          type: 'AA',
          smartLinkId: '1125318169-598002',
          amount: -21.79,
          currencyCode: 'EUR',
          originalAmount: -21.79,
          originalCurrency: 'EUR',
          exchangeRate: 1.0,
          merchantCity: 'PARIS        ',
          visibleTS: 1455292872000,
          mcc: 5977,
          mccGroup: 4,
          merchantName: 'PANDORA CORP          ',
          merchantId: '6260861        ',
          recurring: false,
          userId: '93c3e18b-830a-4758-bb96-ef4d1d859fc3',
          linkId: '1125318169-598002',
          accountId: 'efe2cc9a-49da-4eea-bfa0-236eac673a8a',
          category: 'micro-shopping',
          cardId: '9d1e122f-76ea-4222-a059-a92348a40ac2',
          pending: false,
          transactionNature: 'NORMAL'
        }]);

      n26.transactions({limit: 20}, (err) => {
        expect(err).to.be.null();

        done();
      });
    });

    it('should filter by categories result', (done) => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/smrt/transactions')
        .query({limit: 50, categories: 'micro-education,micro-atm'})
        .reply(200, []);

      n26.transactions({categories: ['micro-education', 'micro-atm']}, (err) => {
        expect(err).to.be.null();

        done();
      });
    });

    it('should filter by date', (done) => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/smrt/transactions')
        .query({limit: 50, from: 1454630400000, to: 1454803199999})
        .reply(200, []);

      n26.transactions({from: 1454630400000, to: 1454803199999}, (err) => {
        expect(err).to.be.null();

        done();
      });
    });

    it('should filter by text', (done) => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/smrt/transactions')
        .query({limit: 50, textFilter: 'loutre'})
        .reply(200, []);

      n26.transactions({text: 'loutre'}, (err) => {
        expect(err).to.be.null();

        done();
      });
    });

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
        .get('/api/smrt/transactions')
        .query({limit: 50})
        .reply(500, {error: 'ERROR'});

      n26.transactions({}, (err) => {
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
        .get('/api/smrt/transactions')
        .query({limit: 50})
        .reply(500);

      n26.transactions({}, (err) => {
        expect(err).to.be.equal(500);

        done();
      });
    });
  });
});
