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

describe('getRecipients', () => {
  describe('Success', () => {
    let api;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/transactions/recipients').reply(200, [{
        iban: 'NL20ABNA0581855476',
        name: 'DUPONT MICHEL',
        bic: 'ABNANL2A'
      }]);
    });

    it('should return recipients', () => {
      return n26.recipients().then((recipients) => {
        expect(recipients).to.be.eql([{
          iban: 'NL20ABNA0581855476',
          name: 'DUPONT MICHEL',
          bic: 'ABNANL2A'
        }]);
      });
    });

    afterEach((done) => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });
});
