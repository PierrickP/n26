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

describe('stats', () => {
  it('should return daily stats for 2 days', () => {
    const from = 1451602800;
    const to = 1451732400;

    const day1 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/accounts/stats?type=acct&from=1451602800000&to=1451775599999&numSlices=1')
      .reply(200, {slices: [{from: 1451602800000, to: 1451775599999, ammount: 42}]});

    const day2 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/accounts/stats?type=acct&from=1451689200000&to=1451861999999&numSlices=1')
      .reply(200, {slices: [{from: 1451689200000, to: 1451861999999, ammount: 30}]});

    return n26.stats(from, to, 'days').then((stats) => {
      expect(stats).to.be.eql([
        {from: 1451602800000, to: 1451775599999, amount: 42},
        {from: 1451689200000, to: 1451861999999, amount: 30}
      ]);

      expect(day1.isDone()).to.be.true();
      expect(day2.isDone()).to.be.true();
    });
  });

  it('should return monthy stats for 2 month', () => {
    const from = new Date('01/01/2016');
    const to = new Date('2/15/2016');

    const day1 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/accounts/stats?type=acct&from=1451602800000&to=1456786799999&numSlices=1')
      .reply(200, {slices: [{from: 1451602800000, to: 1456786799999, ammount: 42}]});

    const day2 = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/accounts/stats?type=acct&from=1454281200000&to=1459461599999&numSlices=1')
      .reply(200, {slices: [{from: 1454281200000, to: 1459461599999, ammount: 30}]});

    return n26.stats(from, to, 'months').then((stats) => {
      expect(stats).to.be.eql([
        {from: 1451602800000, to: 1456786799999, amount: 42},
        {from: 1454281200000, to: 1459461599999, amount: 30}
      ]);

      expect(day1.isDone()).to.be.true();
      expect(day2.isDone()).to.be.true();
    });
  });

  it('should return error if param missing', () => {
    const from = new Date('01/01/2016');

    return n26.stats(from).catch((err) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('MISSING_PARAMS');
    });
  });

  it('should return error if invalid interval', () => {
    const from = new Date('01/01/2016');
    const to = 1451732400;

    return n26.stats(from, to, 'yolo').catch((err) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('BAD_PARAMS');
    });
  });
});
