'use strict';
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const N26 = require('../index');

const expect = chai.expect;

chai.use(dirtyChai);

describe('Create instance', () => {
  describe('Success', () => {
    let api;
    const data = require('./fixtures/data');

    beforeEach(() => {
      api = nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      })
      .post('/oauth/token', {
        username: 'username@mail.com',
        password: 'password',
        grant_type: 'password'
      })
      .reply(200, data.account);
    });

    it('should pass identifiants to oauth endpoint', () => {
      return new N26('username@mail.com', 'password')
        .catch(err => {
          expect(err).to.be.null();
        });
    });

    it('should create a new instance', () => {
      return new N26('username@mail.com', 'password')
        .then(m => {
          expect(m.logged).to.be.true();
          expect(m.email).to.be.eql('username@mail.com');
          expect(m.password).to.be.eql('password');
          expect(m.createdAt).to.exist().and.be.a('number');
          expect(m.accessToken).to.be.equal(data.account.access_token);
          expect(m.expiresIn).to.be.equal(data.account.expires_in);
          expect(m.jti).to.be.equal(data.account.jti);
          expect(m.scope).to.be.eql(['read', 'write', 'trust', 'update']);
          expect(m.tokenType).to.be.equal('bearer');
        })
        .catch(err => {
          expect(err).to.be.null();
        });
    });

    it('should be a distinc instance', () => {
      nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      })
      .post('/oauth/token', {
        username: 'username@mail.com',
        password: 'password',
        grant_type: 'password'
      })
      .reply(200, data.account);

      return Promise.all([
        new N26('username@mail.com', 'password'),
        new N26('username@mail.com', 'password')
      ])
      .then((instance1, instance2) => {
        expect(instance1).to.not.be.equal(instance2);
      });
    });

    afterEach(done => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    it('should return error', () => {
      nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      })
      .post('/oauth/token', {
        username: 'badusername@mail.com',
        password: 'password',
        grant_type: 'password'
      })
      .reply(400, {error: 'invalid_grant', error_description: 'Bad credentials'});

      return new N26('badusername@mail.com', 'password')
        .catch(err => {
          expect(err).to.be.eql({error: 'invalid_grant', error_description: 'Bad credentials'});
        });
    });

    it('should return only status code', () => {
      nock('https://api.tech26.de', {
        authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
      })
      .post('/oauth/token', {
        username: 'badusername@mail.com',
        password: 'password',
        grant_type: 'password'
      })
      .reply(500, '');

      return new N26('badusername@mail.com', 'password')
        .catch(err => {
          expect(err).to.be.equal(500);
        });
    });
  });
});

describe('Static', () => {
  require('./static/barzahlen');
});

describe('account', () => {
  require('./account/account');
  require('./account/addresses');
  require('./account/auth');
  require('./account/barzahlen');
  require('./account/categories');
  require('./account/cards');
  require('./account/contacts');
  require('./account/csv');
  require('./account/invitations');
  require('./account/limits');
  require('./account/me');
  require('./account/memo');
  require('./account/statement');
  require('./account/statements');
  require('./account/stats');
  require('./account/statuses');
  require('./account/transaction');
  require('./account/transactions');
  require('./account/transfer');
  require('./account/unpair');
});

describe('card', () => {
  require('./card/block');
  require('./card/limits');
});
