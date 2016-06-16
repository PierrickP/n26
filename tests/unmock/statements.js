'use strict';
/* eslint-disable global-require, max-len, no-console, arrow-body-style */

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

chai.use(dirtyChai);

const statementsProperties = [
  'id',
  'month',
  'url',
  'visibleTS',
  'year'
];

describe('Statements', () => {
  it('should return statements', () => {
    return global.n26.statements().then((statements) => {
      statements.forEach((statement) => {
        statementsProperties.forEach((property) => {
          expect(statement).to.have.deep.property(property);
        });
      });

      console.log(`\tLast statements for ${statements[0].month}/${statements[0].year}`);
    });
  });

  if (global.CONFIG.options.indexOf('Statement') === -1) {
    xit('should get last statement file');
  } else {
    it('should get last statement file', function () { // eslint-disable-line func-names
      this.timeout(25000);

      return global.n26.statements().then((statements) => statements[0].id)
      .then(statementId => {
        return Promise.all([
          global.n26.statement(statementId),
          global.n26.statement(statementId, true)
        ]);
      })
      .spread((base64, pdf) => {
        [base64, pdf].forEach((statement) => {
          ['id', 'type', 'pdf'].forEach((property) => {
            expect(statement).to.have.deep.property(property);
          });
        });

        expect(base64.pdf).to.be.a('String');
        expect(Buffer.isBuffer(pdf.pdf)).to.be.true();
      });
    });
  }
});
