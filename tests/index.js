'use strict';
/* eslint-disable global-require, max-len */
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const number26 = require('../index');

chai.use(dirtyChai);

describe('Create instance', () => {
  describe('Success', () => {
    let api;
    const data = require('./fixtures/data');

    beforeEach(() => {
      api = nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      }).post('/oauth/token', {
        username: process.env.TEST_USERNAME || 'username@mail.com',
        password: process.env.TEST_PASSWORD || 'password',
        grant_type: 'password'
      }).reply(200, data);
    });

    it('should pass identifiants to oauth endpoint', () => { // eslint-disable-line arrow-body-style
      return number26.auth(process.env.TEST_USERNAME || 'username@mail.com', process.env.TEST_PASSWORD || 'password')
        .catch((err) => {
          expect(err).to.be.null();
        });
    });

    it('should create a new instance', () => { // eslint-disable-line arrow-body-style
      return number26.auth(process.env.TEST_USERNAME || 'username@mail.com', process.env.TEST_PASSWORD || 'password')
        .then((m) => {
          expect(m.createdAt).to.not.be.null();
          expect(m.accessToken).to.be.equal(data.access_token);
          expect(m.expiresIn).to.be.equal(data.expires_in);
          expect(m.jti).to.be.equal(data.jti);
          expect(m.scope).to.be.equal('read write trust');
          expect(m.tokenType).to.be.equal('bearer');
        })
        .catch((err) => {
          expect(err).to.be.null();
        });
    });

    afterEach((done) => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    it('should return error', () => {
      nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      }).post('/oauth/token', {
        username: 'badusername@mail.com',
        password: 'password',
        grant_type: 'password'
      }).reply(400, {error: 'invalid_grant', error_description: 'Bad credentials'});

      return number26.auth('badusername@mail.com', 'password')
        .catch((err) => {
          expect(err).to.be.eql({error: 'invalid_grant', error_description: 'Bad credentials'});
        });
    });

    it('should return only status code', () => {
      nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      }).post('/oauth/token', {
        username: 'badusername@mail.com',
        password: 'password',
        grant_type: 'password'
      }).reply(500, '');

      number26.auth('badusername@mail.com', 'password')
        .catch((err) => {
          expect(err).to.be.equal(500);
        });
    });
  });
});

describe('account', () => {
  require('./account/memo');
  require('./account/createTransfer');
  require('./account/getAccount');
  require('./account/getAddresses');
  require('./account/getCards');
  require('./account/getMe');
  require('./account/getRecipients');
  require('./account/getTransactions');
});
