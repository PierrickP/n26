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

describe('barzahlen', () => {
  const dataBarzahlen = {
    depositAllowance: '999.0',
    withdrawAllowance: '999.0',
    remainingAmountMonth: '100.0',
    feeRate: '0.015',
    cash26WithdrawalsCount: '0',
    cash26WithdrawalsSum: '0',
    atmWithdrawalsCount: '3',
    atmWithdrawalsSum: '80.0',
    monthlyDepositFeeThreshold: '100.0',
    success: false
  };

  it('should return barzahlen', () => {
    const apiBarzahlen = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/barzahlen/check')
      .reply(200, dataBarzahlen);

    return n26.barzahlen().then((barzahlen) => {
      expect(barzahlen).to.be.eql(dataBarzahlen);

      expect(apiBarzahlen.isDone()).to.be.true();
    });
  });
});
