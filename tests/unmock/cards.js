'use strict';
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

describe('Card', () => {
  let card;
  let limitOnline;

  before(done => {
    global.n26.cards()
      .then(cards => {
        card = cards[0];

        done();
      });
  });

  it('should get cards', () => {
    return global.n26.cards()
      .then(cards => {
        expect(cards).to.be.an('array');

        console.log(`\t${cards.length} cards`);

        cards.forEach(c => {
          expect(c).to.have.property('maskedPan');
          expect(c).to.have.property('expirationDate');
          expect(c).to.have.property('cardType');
          expect(c).to.have.property('status');
          expect(c).to.have.property('pinDefined');
          expect(c).to.have.property('cardActivated');
          expect(c).to.have.property('usernameOnCard');
          expect(c).to.have.property('id');

          console.log(`\t- ${c.cardType} ${c.status} ${c.maskedPan}`);
        });
      });
  });

  it('should get card limits', () => {
    return card.limits()
      .then(limits => {
        expect(limits).to.be.an('Array');
        limits.forEach(l => {
          expect(l).to.have.property('limit');
          if (l.limit === 'COUNTRY_LIST') {
            expect(l).to.have.property('countryList');
          } else {
            expect(l).to.have.property('amount');

            if (l.limit === 'E_COMMERCE_TRANSACTION') {
              limitOnline = l.amount;
            }
          }
        });

        console.log(`\tCard limits ${limits[0].limit} -> ${limits[0].amount}`);
      });
  });

  it('should set card limits', () => {
    return card.limits({
      amount: (limitOnline) ? 0 : 5000,
      limit: 'E_COMMERCE_TRANSACTION'
    })
    .then(l => {
      console.log(`\tCard set limit ${l.limit}: ${l.amount}`);

      return card.limits({amount: limitOnline, limit: 'E_COMMERCE_TRANSACTION'});
    });
  });

  it('should block card', () => {
    return card.block()
      .then(() => global.n26.cards())
      .then(c => {
        console.log(`\tCard status: ${c[0].status}`);
      });
  });

  it('should unblock card', () => {
    return card.unblock()
      .then(() => global.n26.cards())
      .then(c => {
        console.log(`\tCard status: ${c[0].status}`);
      });
  });
});
