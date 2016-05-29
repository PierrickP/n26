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

describe('getMe', () => {
  describe('Success', () => {
    it('should return me', () => {
      const apiMe = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/me')
        .reply(200, {
          email: 'g.loutre@mail.com',
          firstName: 'George',
          lastName: 'loutre',
          kycFirstName: 'George',
          kycLastName: 'Loutre',
          title: '',
          gender: 'MALE',
          birthDate: 602380800000,
          passwordHash: '$2a$10$YIxk0A.QvM7sym42k7xjUuCePrW3xmrqnzjcl5aleWD9A0bThXGkq',
          signupCompleted: true,
          nationality: 'FRA',
          birthPlace: 'PARIS',
          mobilePhoneNumber: '+3364242424242',
          taxIDRequired: true,
          shadowID: '184be12-7e88-4cbe-a461-a7776bd2664d',
          id: '184be12-7e88-4cbe-a461-a7776bd2664d'
        });

      return n26.me().then((me) => {
        expect(me).to.be.eql({
          email: 'g.loutre@mail.com',
          firstName: 'George',
          lastName: 'loutre',
          kycFirstName: 'George',
          kycLastName: 'Loutre',
          title: '',
          gender: 'MALE',
          birthDate: 602380800000,
          passwordHash: '$2a$10$YIxk0A.QvM7sym42k7xjUuCePrW3xmrqnzjcl5aleWD9A0bThXGkq',
          signupCompleted: true,
          nationality: 'FRA',
          birthPlace: 'PARIS',
          mobilePhoneNumber: '+3364242424242',
          taxIDRequired: true,
          shadowID: '184be12-7e88-4cbe-a461-a7776bd2664d',
          id: '184be12-7e88-4cbe-a461-a7776bd2664d'
        });

        expect(apiMe.isDone()).to.be.true();
      });
    });

    it('should return me with full option', () => {
      const apiMe = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/me')
        .query({full: true})
        .reply(200, {
          email: 'g.loutre@mail.com',
          firstName: 'George',
          lastName: 'loutre',
          kycFirstName: 'George',
          kycLastName: 'Loutre',
          title: '',
          gender: 'MALE',
          birthDate: 602380800000,
          passwordHash: '$2a$10$YIxk0A.QvM7sym42k7xjUuCePrW3xmrqnzjcl5aleWD9A0bThXGkq',
          signupCompleted: true,
          nationality: 'FRA',
          birthPlace: 'PARIS',
          mobilePhoneNumber: '+3364242424242',
          taxIDRequired: true,
          shadowID: '184be12-7e88-4cbe-a461-a7776bd2664d',
          id: '184be12-7e88-4cbe-a461-a7776bd2664d'
        });

      return n26.me(true).then(() => {
        expect(apiMe.isDone()).to.be.true();
      });
    });
  });
});
