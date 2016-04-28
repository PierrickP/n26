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

describe('getCards', () => {
  describe('Success', () => {
    let api;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/cards').reply(200, {
        paging: {
          totalResults: 1
        },
        data: [{
          maskedPan: '517337******4242',
          expirationDate: 1548870576000,
          cardType: 'MASTERCARD',
          n26Status: 'ACTIVE',
          pinDefined: 1454698655841,
          cardActivated: 1454698679301,
          usernameOnCard: 'GEORGE LOUTRE',
          id: '203f3cc1-1bbb-4a3a-861c-2ac21fd8a77e'
        }]
      });
    });

    it('should return cards', (done) => {
      n26.cards((err, account) => {
        expect(err).to.be.null();

        expect(account).to.be.eql({
          paging: {
            totalResults: 1
          },
          data: [{
            maskedPan: '517337******4242',
            expirationDate: 1548870576000,
            cardType: 'MASTERCARD',
            n26Status: 'ACTIVE',
            pinDefined: 1454698655841,
            cardActivated: 1454698679301,
            usernameOnCard: 'GEORGE LOUTRE',
            id: '203f3cc1-1bbb-4a3a-861c-2ac21fd8a77e'
          }]
        });

        done();
      });
    });

    afterEach((done) => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    it('should return account', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/cards').reply(500, {error: 'ERROR'});

      n26.cards((err) => {
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
        .get('/api/cards').reply(500);

      n26.cards((err) => {
        expect(err).to.be.equal(500);

        done();
      });
    });
  });
});
