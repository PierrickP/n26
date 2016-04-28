'use strict';
/* eslint-disable global-require */
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

describe('getAddresses', () => {
  describe('Success', () => {
    let api;

    beforeEach(() => {
      api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/addresses').reply(200, {
        paging: {
          totalResults: 2
        },
        data: [{
          addressLine1: 'Maëlys Roux',
          streetName: 'Rue du chat qui pêche',
          houseNumberBlock: '1',
          zipCode: '75001',
          cityName: 'PARIS',
          countryName: 'FRA',
          type: 'PASSPORT',
          id: '78b7506b-06ae-4b47-80a7-be300acb3175'
        }, {
          addressLine1: '',
          streetName: 'Rue de la roquette',
          houseNumberBlock: '42',
          zipCode: '75011',
          cityName: 'Paris',
          countryName: 'FRA',
          type: 'SHIPPING',
          id: 'ad1932e4-a968-454d-a64b-11476d6fa34a'
        }]
      });
    });

    it('should return addresses', (done) => {
      n26.addresses((err, account) => {
        expect(err).to.be.null();

        expect(account).to.be.eql({
          paging: {
            totalResults: 2
          },
          data: [{
            addressLine1: 'Maëlys Roux',
            streetName: 'Rue du chat qui pêche',
            houseNumberBlock: '1',
            zipCode: '75001',
            cityName: 'PARIS',
            countryName: 'FRA',
            type: 'PASSPORT',
            id: '78b7506b-06ae-4b47-80a7-be300acb3175'
          }, {
            addressLine1: '',
            streetName: 'Rue de la roquette',
            houseNumberBlock: '42',
            zipCode: '75011',
            cityName: 'Paris',
            countryName: 'FRA',
            type: 'SHIPPING',
            id: 'ad1932e4-a968-454d-a64b-11476d6fa34a'
          }]
        });

        done();
      });
    });

    afterEach((done) => {
      done((!api.isDone()) ? new Error('Request not done') : null);
    });
  });

  describe('Error', () => {
    it('should return account', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/addresses').reply(500, {error: 'ERROR'});

      n26.addresses((err) => {
        expect(err).to.be.eql({error: 'ERROR'});

        done();
      });
    });

    it('should return only status code', (done) => {
      nock('https://api.tech26.de')
        .defaultReplyHeaders({
          'Content-Type': 'application/json'
        })
        .matchHeader('Authorization', `Bearer ${data.access_token}`)
        .get('/api/addresses').reply(500);

      n26.addresses((err) => {
        expect(err).to.be.equal(500);

        done();
      });
    });
  });
});
