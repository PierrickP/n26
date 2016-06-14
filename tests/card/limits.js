'use strict';
/* eslint-disable global-require, max-len, arrow-body-style */
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const Card = require('../../lib/card.js');

chai.use(dirtyChai);

let card;
const data = require('../fixtures/data');

beforeEach((done) => {
  require('../fixtures/auth')((err, m) => {
    card = new Card(m, data.card);

    done();
  });
});

describe('limits', () => {
  it('should return limits', () => {
    const limits = [{
      limit: 'POS_TRANSACTION',
      amount: 10000
    }, {
      limit: 'ATM_TRANSACTION_MONTLY',
      amount: 20000
    }, {
      limit: 'POS_TRANSACTION_MONTHLY',
      amount: 20000
    }, {
      limit: 'ATM_TRANSACTION',
      amount: 600
    }, {
      limit: 'E_COMMERCE_TRANSACTION',
      amount: 5000
    }, {
      limit: 'E_COMMERCE_TRANSACTION_MONTHLY',
      amount: 20000
    }, {
      limit: 'COUNTRY_LIST',
      countryList: []
    }];

    const apiLimits = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get(`/api/settings/limits/${card.id}`)
      .reply(200, limits);

    return card.limits().then((l) => {
      expect(l).to.be.eql(limits);

      expect(apiLimits.isDone()).to.be.true();
    });
  });
});
