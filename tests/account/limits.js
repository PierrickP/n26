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

describe('limits', () => {
  it('should get limits', () => {
    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/settings/account/limits')
      .reply(200, [{
        limit: 'ATM_DAILY_ACCOUNT',
        amount: 2500
      }, {
        limit: 'POS_DAILY_ACCOUNT',
        amount: 5000
      }]);

    return n26.limits().then((limits) => {
      expect(limits).to.be.eql([{
        limit: 'ATM_DAILY_ACCOUNT',
        amount: 2500
      }, {
        limit: 'POS_DAILY_ACCOUNT',
        amount: 5000
      }]);

      expect(api.isDone()).to.be.ok();
    });
  });

  it('should set limits', () => {
    const apiAtm = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .post('/api/settings/account/limits', {limit: 'ATM_DAILY_ACCOUNT', amount: 200})
      .reply(200);

    const apiPos = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .post('/api/settings/account/limits', {limit: 'POS_DAILY_ACCOUNT', amount: 0})
      .reply(200);

    return n26.limits({
      atm: 200,
      pos: 0
    }).then(() => {
      expect(apiAtm.isDone()).to.be.ok();
      expect(apiPos.isDone()).to.be.ok();
    });
  });

  it('should return error is setting a bad value limits', () => {
    return n26.limits({atm: 50000}).catch((err) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('Limits should be between 0 and 2500');
    });
  });
});
