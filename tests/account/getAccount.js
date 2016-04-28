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

describe('getAccount', () => {
  describe('Success', () => {
    let api;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/accounts').reply(200, {
          status: 'OPEN_PRIMARY_ACCOUNT',
          availableBalance: 42.42,
          usableBalance: 42.42,
          bankBalance: 4242.00,
          iban: 'NL72SNSB0931762238',
          id: 'e112c309-80df-4016-8079-93ffdea8300e'
        });
    });

    it('should return account', (done) => {
      n26.account((err, account) => {
        expect(err).to.be.null();

        expect(account).to.be.eql({
          status: 'OPEN_PRIMARY_ACCOUNT',
          availableBalance: 42.42,
          usableBalance: 42.42,
          bankBalance: 4242.00,
          iban: 'NL72SNSB0931762238',
          id: 'e112c309-80df-4016-8079-93ffdea8300e'
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
        .get('/api/accounts').reply(500, {error: 'ERROR'});

      n26.account().then().catch((err) => {
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
        .get('/api/accounts').reply(500);

      n26.account((err) => {
        expect(err).to.be.equal(500);

        done();
      });
    });
  });
});
