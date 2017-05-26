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

describe('pair', () => {
  it('should init pair', () => {
    const apiPair = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/ps/pairing/request')
      .reply(200);

    return n26.pairInit()
      .then(() => {
        expect(apiPair.isDone()).to.be.true();
      });
  });

  it('should send random string / public key', function () { // eslint-disable-line func-names
    this.timeout(50000);

    const pairConfirm = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .post('/api/ps/pairing/initiate', {
        publicKey: /.+/,
        pkp: /\w{26}/,
        PiPin: '1234'
      })
      .reply(200);

    return n26.pairConfirm('1234')
      .then((keys) => {
        expect(pairConfirm.isDone()).to.be.true();

        expect(keys).to.have.property('privateKey');
        expect(keys).to.have.property('publicKey');
        expect(keys).to.have.property('pkp');
      });
  });
});
