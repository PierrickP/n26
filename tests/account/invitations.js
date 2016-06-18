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

describe('invitations', () => {
  describe('Success', () => {
    it('should get invitations', () => {
      const apiInvite = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .get('/api/aff/invitations')
        .reply(200, [{
          invited: 'example@example.com',
          status: 'PENDING',
          reward: 10,
          created: 1463599438867
        }]);

      return n26.invitations().then((invitations) => {
        expect(invitations).to.be.eql([{
          invited: 'example@example.com',
          status: 'PENDING',
          reward: 10,
          created: 1463599438867
        }]);

        expect(apiInvite.isDone()).to.be.true();
      });
    });

    it('should get a single invitations', () => {
      const apiInvite = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/aff/invite', {email: 'example@mail.com'})
        .reply(200);

      return n26.invitations('example@mail.com').then(() => {
        expect(apiInvite.isDone()).to.be.true();
      });
    });

    it('should get a multi invitations', () => {
      const apiInvite = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/aff/invite', {email: 'example@mail.com'})
        .reply(200);
      const apiInvite2 = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/aff/invite', {email: 'example2@mail.com'})
        .reply(200);

      return n26.invitations(['example@mail.com', 'example2@mail.com']).then(() => {
        expect(apiInvite.isDone()).to.be.true();
        expect(apiInvite2.isDone()).to.be.true();
      });
    });
  });
});
