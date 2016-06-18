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

describe('Unpair mobile', () => {
  describe('Success', () => {
    let apiUpstart;
    let apiVerify;
    let apiValidationPin;
    let apiValidationCard;
    let apiValidationSms;
    let apiValidationSmsVerify;

    before(() => {
      apiUpstart = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/uppstart')
        .reply(200, {
          success: true,
          message: 'https://my.number26.de/unpair/04e0a432-ee9a-4cf9-b384-3480f838e3e0',
          date: '05/19/2016 11:29:42.763'
        });

      apiVerify = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/verify/04e0a432-ee9a-4cf9-b384-3480f838e3e0')
        .reply(200, {
          success: true,
          message: 'Deep link validated!',
          date: '05/19/2016 11:29:42.763'
        });

      apiValidationPin = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/validation/pin', {
          pin: '1234'
        })
        .reply(200, {
          success: true,
          message: 'Deep link validated!',
          date: '05/18/2016 18:54:08.662',
          pin: '1234'
        });

      apiValidationCard = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/validation/card/1234567890')
        .reply(200, {
          success: true,
          message: 'User card public token number is valid',
          date: '05/18/2016 18:54:08.662'
        });

      apiValidationSms = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/validation/sms/send')
        .reply(200, {
          success: true,
          message: 'User card public token number is valid',
          date: '05/18/2016 18:54:08.662'
        });

      apiValidationSmsVerify = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/validation/sms/verify/12345')
        .reply(200);
    });

    it('should init unpair', (cb) => {
      return n26.unpairInit('1234', '1234567890')
        .then(() => {
          expect(apiUpstart.isDone()).to.be.true();
          expect(apiVerify.isDone()).to.be.true();
          expect(apiValidationPin.isDone()).to.be.true();
          expect(apiValidationCard.isDone()).to.be.true();
          expect(apiValidationSms.isDone()).to.be.true();

          cb();
        })
        .catch(cb);
    });

    it('should confirm unpair', (cb) => {
      return n26.unpairConfirm('12345')
        .then(() => {
          expect(apiValidationSmsVerify.isDone()).to.be.true();

          cb();
        })
        .catch(cb);
    });
  });

  describe('Error', () => {
    let apiUpstart;
    let apiVerify;

    before(() => {
      apiUpstart = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/uppstart')
        .reply(200, {
          success: true,
          message: 'https://my.number26.de/unpair/04e0a432-ee9a-4cf9-b384-3480f838e3e0',
          date: '05/19/2016 11:29:42.763'
        });

      apiVerify = nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
        .post('/api/unpair/verify/04e0a432-ee9a-4cf9-b384-3480f838e3e0')
        .reply(200, {
          success: false,
          message: 'Deep link NOT validated!',
          date: '05/19/2016 11:29:42.763'
        });
    });

    it('should init unpair', (cb) => {
      return n26.unpairInit('1234', '1234567890')
        .then(() => {})
        .catch((err) => {
          expect(err).to.be.eql({
            success: false,
            message: 'Deep link NOT validated!',
            date: '05/19/2016 11:29:42.763'
          });
          expect(apiUpstart.isDone()).to.be.true();
          expect(apiVerify.isDone()).to.be.true();

          cb();
        });
    });
  });
});
