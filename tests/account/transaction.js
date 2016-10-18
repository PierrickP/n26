'use strict';
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

let n26;
const data = require('../fixtures/data');

beforeEach(done => {
  require('../fixtures/auth')((err, m) => {
    n26 = m;

    done();
  });
});

describe('transaction', () => {
  before(() => {
    nock.cleanAll();
  });

  describe('Success', () => {
    it('should return transaction', () => {
      const api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .get('/api/smrt/transactions/bbd24eb7-925a-48dd-9c1e-75bb9f514d78')
        .reply(200, {
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
          transactionNature: 'NORMAL',
          tags: []
        });

      return n26.transaction('bbd24eb7-925a-48dd-9c1e-75bb9f514d78').then(t => {
        expect(t).to.be.eql({
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
          transactionNature: 'NORMAL',
          tags: []
        });

        expect(api.isDone()).to.be.true();
      });
    });

    it('should return transaction with meta', () => {
      const api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .get('/api/smrt/transactions/bbd24eb7-925a-48dd-9c1e-75bb9f514d78')
        .reply(200, {
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
          transactionNature: 'NORMAL',
          tags: []
        });

      const apiMeta = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata')
        .reply(200, {
          memo: 'tata yolo'
        });

      return n26.transaction('bbd24eb7-925a-48dd-9c1e-75bb9f514d78', {meta: true}).then(t => {
        expect(t).to.be.eql({
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
          transactionNature: 'NORMAL',
          tags: [],
          meta: {
            memo: 'tata yolo'
          }
        });

        expect(api.isDone()).to.be.true();
        expect(apiMeta.isDone()).to.be.true();
      });
    });
  });
});
