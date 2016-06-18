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

describe('block / unblock', () => {
  it('should block', () => {
    const apiLimits = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .post(`/api/cards/${card.id}/block`)
      .reply(200);

    return card.block().then(() => {
      expect(card.n26Status).to.be.eql('BLOCKED');
      expect(apiLimits.isDone()).to.be.true();
    });
  });

  it('should unblock', () => {
    const apiLimits = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .post(`/api/cards/${card.id}/unblock`)
      .reply(200);

    return card.unblock().then(() => {
      expect(card.n26Status).to.be.eql('ACTIVE');
      expect(apiLimits.isDone()).to.be.true();
    });
  });
});
