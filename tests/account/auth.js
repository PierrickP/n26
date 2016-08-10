'use strict';
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

let n26;
const data = require('../fixtures/data');

describe('auth', () => {
  let api;
  let api2;

  before((done) => {
    require('../fixtures/auth')((err, m) => {
      m.createdAt = +new Date() / 1000 - 10000;
      n26 = m;

      done();
    });
  });

  beforeEach(() => {
    api2 = nock('https://api.tech26.de', {
      authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
    })
    .post('/oauth/token', {
      username: 'username@mail.com',
      password: 'password',
      grant_type: 'password'
    })
    .reply(200, data.account);

    api = nock('https://api.tech26.de')
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
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
  });

  it('should reauth', () => { // eslint-disable-line arrow-body-style
    return n26.me().then(() => {
      expect(api.isDone()).to.be.true();
      expect(api2.isDone()).to.be.true();
    });
  });
});
