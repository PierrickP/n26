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

describe('contacts', () => {
  let api;
  const dataContacts = [{
    id: 'c22ed0fa-2b24-48cf-a0dc-5df87b71f413',
    name: 'POULPE GEORGE',
    subtitle: 'NL84 DLBK 0283 8859 17',
    account: {
      accountType: 'sepa',
      iban: 'NL84DLBK0283885917',
      bic: 'ABNANL2A'
    }
  }];

  beforeEach(() => {
    api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/smrt/contacts')
      .reply(200, dataContacts);
  });

  it('should return account', () => {
    return n26.contacts().then((contacts) => {
      expect(contacts).to.be.eql(dataContacts);
    });
  });

  afterEach((done) => {
    done((!api.isDone()) ? new Error('Request not done') : null);
  });
});
