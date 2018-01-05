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

describe('csv', () => {
  it('should return csv', () => {
    const fromDate = 1463781923086;
    const toDate = 1466411669086;
    const csvData = `"Date","Bénéficiaire","Numéro de compte","Type de transaction","Référence de paiement","Catégorie","Montant (EUR)","Montant (Devise étrangère)","Sélectionnez la devise étrangère","Taux de conversion"
"2016-05-21","QU1                   ","","Paiement par MasterCard","","Restaurants & Bars","-13.0","-13.0","EUR","1.0"
"2016-05-21","42 BOULEVARD DE SEBAST","","Paiement par MasterCard","","Retrait","-20.0","-20.0","EUR","1.0"
"2016-05-22","GAB RICHARD LENOIR    ","","Paiement par MasterCard","","Retrait","-40.0","-40.0","EUR","1.0"
"2016-05-22","Uber BV               ","","Paiement par MasterCard","","Transport","-6.0","-6.0","EUR","1.0"
"2016-05-26","MC DONALD'S           ","","Paiement par MasterCard","","Restaurants & Bars","-7.9","-7.9","EUR","1.0"
"2016-05-28","CM PARIS LA ROQUETTE  ","","Paiement par MasterCard","","Retrait","-20.0","-20.0","EUR","1.0"
"2016-06-02","Uber BV               ","","Paiement par MasterCard","","Transport","-9.12","-9.12","EUR","1.0"
"2016-06-05","Uber BV               ","","Paiement par MasterCard","","Transport","-21.4","-21.4","EUR","1.0"
`;

    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'text/csv;charset=UTF-8',
        'Content-Disposition':
          'form-data; name="attachment"; filename="20160521-20160620.csv"'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get(`/api/smrt/reports/${fromDate}/${toDate}/statements`)
      .reply(200, csvData);

    return n26.csv(fromDate, toDate).then(csv => {
      expect(csv).to.be.eql(csvData);

      expect(api.isDone()).to.be.true();
    });
  });

  it.skip('should convert date to timestamp', () => {
    const toDate = 1466411669086;
    const csvData = `"Date","Bénéficiaire","Numéro de compte","Type de transaction","Référence de paiement","Catégorie","Montant (EUR)","Montant (Devise étrangère)","Sélectionnez la devise étrangère","Taux de conversion"
"2016-05-21","QU1                   ","","Paiement par MasterCard","","Restaurants & Bars","-13.0","-13.0","EUR","1.0"
`;

    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'text/csv;charset=UTF-8',
        'Content-Disposition':
          'form-data; name="attachment"; filename="20160521-20160620.csv"'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get(`/api/smrt/reports/1463788800000/${toDate}/statements`)
      .reply(200, csvData);

    return n26.csv(new Date('2016-05-21T00:00:00'), toDate).then(csv => {
      expect(csv).to.be.eql(csvData);

      expect(api.isDone()).to.be.true();
    });
  });

  it('should set `to` per default', () => {
    const fromDate = 1463788800000;
    const csvData = `"Date","Bénéficiaire","Numéro de compte","Type de transaction","Référence de paiement","Catégorie","Montant (EUR)","Montant (Devise étrangère)","Sélectionnez la devise étrangère","Taux de conversion"
"2016-05-21","QU1                   ","","Paiement par MasterCard","","Restaurants & Bars","-13.0","-13.0","EUR","1.0"
`;

    const api = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'text/csv;charset=UTF-8',
        'Content-Disposition':
          'form-data; name="attachment"; filename="20160521-20160620.csv"'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get(uri => {
        const uriMatch = uri.match(
          /api\/smrt\/reports\/(\d{13})\/(\d{13})\/statements/
        );

        if (!uriMatch || uriMatch.length < 3) {
          return false;
        }

        if (
          uriMatch[1] !== String(fromDate) ||
          Math.trunc(uriMatch[2] / 1000000) !==
            Math.trunc(new Date().getTime() / 1000000)
        ) {
          return false;
        }

        return true;
      })
      .reply(200, csvData);

    return n26.csv(fromDate).then(csv => {
      expect(csv).to.be.eql(csvData);

      expect(api.isDone()).to.be.true();
    });
  });

  it('should return error if `from` is missing', () => {
    return n26.csv().catch(err => {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('MISSING_PARAMS');
    });
  });
});
