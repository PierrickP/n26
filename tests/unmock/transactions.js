'use strict';
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

const commonTransactionFields = ['id', 'userId', 'type', 'amount', 'smartLinkId', 'linkId', 'accountId', 'category', 'cardId', 'pending', 'transactionNature', 'visibleTS', 'recurring'];

const transactionFields = {
  PT: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId']),
  DT: commonTransactionFields.concat(['partnerAccountIsSepa', 'partnerName', 'partnerIban', 'referenceText', 'userCertified', 'smartContactId']),
  CT: commonTransactionFields.concat(['currencyCode', 'partnerBic', 'partnerAccountIsSepa', 'partnerName', 'partnerIban', 'referenceText', 'smartContactId', 'confirmed']),
  AE: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId']),
  AA: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId', 'transactionTerminal'])
};

describe('Transactions', () => {
  it('should get transactions - limit 2', () => {
    return global.n26.transactions({limit: 2})
      .then(transactions => {
        expect(transactions).to.be.an('array');

        console.log(`\tLast ${transactions.length} transactions`);

        transactions.forEach(t => {
          expect(t).to.have.property('type');

          if (!transactionFields[t.type]) {
            console.log(t);
          }

          transactionFields[t.type].forEach(f => {
            expect(t).to.have.property(f);
          });

          console.log(`\t- ${t.type} ${t.amount} ${t.merchantName || t.partnerName}`);
        });
      });
  });

  it('should get transaction detail', () => {
    return global.n26.transactions()
      .then(transactions => {
        return global.n26.transaction(transactions[0].id).then(detail => {
          transactionFields[detail.type].forEach(property => {
            expect(detail).to.have.deep.property(property);
          });
        });
      });
  });

  it('should update memo on transaction', () => {
    return global.n26.transactions()
      .then(transactions => {
        return global.n26.transaction(transactions[0].id, {meta: true}).then(d => {
          const previousMemo = d.meta.memo;
          const newMemo = `YOLO${Math.round(Math.random() * 1000)}`;

          return global.n26.memo(transactions[0].smartLinkId, newMemo)
            .then(() => {
              return global.n26.transaction(transactions[0].id, {meta: true}).then(dd => {
                expect(dd.meta.memo).to.be.eql(newMemo);

                return global.n26.memo(transactions[0].smartLinkId, previousMemo);
              });
            });
        });
      });
  });
});
