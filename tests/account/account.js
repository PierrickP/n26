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

describe('account', () => {
  let api;

  beforeEach(() => {
    api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/accounts')
      .reply(200, {
        availableBalance: 42.42,
        usableBalance: 42.42,
        bankBalance: 4242.0,
        iban: 'NL72SNSB0931762238',
        bankName: 'N26 Bank',
        seized: false,
        id: 'e112c309-80df-4016-8079-93ffdea8300e'
      });
  });

  it('should return account', () => {
    return n26.account().then(account => {
      expect(account).to.be.eql({
        availableBalance: 42.42,
        usableBalance: 42.42,
        bankBalance: 4242.0,
        iban: 'NL72SNSB0931762238',
        bankName: 'N26 Bank',
        seized: false,
        id: 'e112c309-80df-4016-8079-93ffdea8300e'
      });
    });
  });

  afterEach(done => {
    done(!api.isDone() ? new Error('Request not done') : null);
  });
});
