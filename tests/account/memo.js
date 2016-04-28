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
      }).reply(200);

      api2 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/transactions/1125318169-598002/metadata').reply(200);
    });

    it('should add memo', (done) => {
      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.null();

        done();
      });
    });

    it('should update memo', (done) => {
      const api3 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .put('/api/transactions/1125318169-598002', {
        memo: 'Tata'
      }).reply(200);

      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata').reply(200, {
          memo: 'hello'
        });

      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.null();

        n26.memo('1125318169-598002', 'Tata', (err2) => {
          expect(err2).to.be.null();
          expect(api3.isDone()).to.be.true();

          done();
        });
      });
    });

    afterEach((done) => {
      done((!api.isDone() && !api2.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    it('should return error on get metadata', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata').reply(500, {error: 'ERROR'});

      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.eql({error: 'ERROR'});

        done();
      });
    });

    it('should return only status code on get metadata', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata').reply(500);

      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.eql(500);

        done();
      });
    });

    it('should return error on create memo', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .post('/api/transactions/1125318169-598002', {
          memo: 'Hello'
        }).reply(500, {error: 'ERROR'});

      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata').reply(200);

      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.eql({error: 'ERROR'});

        done();
      });
    });

    it('should return only status code memo', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .post('/api/transactions/1125318169-598002', {
          memo: 'Hello'
        }).reply(500);

      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/transactions/1125318169-598002/metadata').reply(200);

      n26.memo('1125318169-598002', 'Hello', (err) => {
        expect(err).to.be.eql(500);

        done();
      });
    });
  });
});
