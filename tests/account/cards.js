'use strict';
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

let n26;
const data = require('../fixtures/data');

const Card = require('../../lib/card.js');

beforeEach(done => {
  require('../fixtures/auth')((err, m) => {
    n26 = m;

    done();
  });
});

describe('cards', () => {
  it('should return cards', () => {
    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/v2/cards')
      .reply(200, [{
        maskedPan: '517337******4242',
        expirationDate: 1548870576000,
        cardType: 'MASTERCARD',
        exceetExpressCardDelivery: false,
        exceetExpressCardDeliveryEmailSent: false,
        status: 'M_ACTIVE',
        cardProduct: null,
        cardProductType: 'STANDARD',
        pinDefined: 1454698655841,
        cardActivated: 1454698679301,
        usernameOnCard: 'GEORGE LOUTRE',
        id: '203f3cc1-1bbb-4a3a-861c-2ac21fd8a77e'
      }]);

    return n26.cards().then(cards => {
      cards.forEach(card => {
        expect(card).to.be.an.instanceof(Card);

        expect(api.isDone()).to.be.true();
      });
    });
  });

  it('should return card', () => {
    const cardId = '203f3cc1-1bbb-4a3a-861c-2ac21fd8a77e';
    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get(`/api/cards/${cardId}`)
      .reply(200, {
        maskedPan: '517337******4242',
        expirationDate: 1548870576000,
        cardType: 'MASTERCARD',
        exceetExpressCardDelivery: false,
        exceetExpressCardDeliveryEmailSent: false,
        pinDefined: 1454698655841,
        cardActivated: 1454698679301,
        usernameOnCard: 'GEORGE LOUTRE',
        id: '203f3cc1-1bbb-4a3a-861c-2ac21fd8a77e'
      });

    return n26.cards(cardId).then(card => {
      expect(card).to.be.an.instanceof(Card);

      expect(api.isDone()).to.be.true();
    });
  });
});
