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

describe('Create or update Memo', () => {
  describe('Success', () => {
    let api;
    let api2;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .post('/api/transactions/1125318169-598002', {
        memo: 'Hello'
      })
      .reply(200);

      api2 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/transactions/1125318169-598002/metadata')
      .reply(200);
    });

    it('should add memo', () => {
      return n26.memo('1125318169-598002', 'Hello').catch((err) => {
        expect(err).to.be.null();
      });
    });

    it('should update memo', () => {
      const api3 = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .put('/api/transactions/1125318169-598002', {
          memo: 'Tata'
        })
        .reply(200);

      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata')
        .reply(200, {
          memo: 'hello'
        });

      return n26.memo('1125318169-598002', 'Hello').catch((err) => {
        expect(err).to.be.null();

        return n26.memo('1125318169-598002', 'Tata').catch((err2) => {
          expect(err2).to.be.null();
          expect(api3.isDone()).to.be.true();
        });
      });
    });

    afterEach((done) => {
      done((!api.isDone() && !api2.isDone()) ? new Error('Request not done') : null);
    });
  });
});
