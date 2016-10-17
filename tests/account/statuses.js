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

describe('statuses', () => {
  describe('Success', () => {
    const dataStatuses = {
      singleStepSignup: 1454160488252,
      emailValidationInitiated: 1454160488252,
      emailValidationCompleted: 1454160502916,
      phonePairingInitiated: 1463684511636,
      phonePairingCompleted: 1463684537290,
      kycInitiated: 1454161122404,
      kycCompleted: 1454161776363,
      kycWebIDInitiated: 1454161122404,
      kycWebIDCompleted: 1454161776363,
      cardActivationCompleted: 1454698679301,
      cardIssued: 1454161776600,
      pinDefinitionCompleted: 1454161883604,
      bankAccountCreationInitiated: 1454313601177,
      bankAccountCreationSucceded: 1454345467989,
      firstIncomingTransaction: 1463065531125,
      smsVerificationCode: '12345',
      unpairTokenCreation: 1463683972226,
      finoIntegrationStatus: 'NEVER',
      id: '184be12-7e88-4cbe-a461-a7776bd2664d'
    };

    it('should return statuses', () => {
      const apiStatuses = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .get('/api/me/statuses')
        .reply(200, dataStatuses);

      return n26.statuses().then(statuses => {
        expect(statuses).to.be.eql(dataStatuses);

        expect(apiStatuses.isDone()).to.be.true();
      });
    });
  });
});
