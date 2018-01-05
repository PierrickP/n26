'use strict';
const nock = require('nock');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

const n26 = require('../../index');

chai.use(dirtyChai);

describe('barzahlen', () => {
  it('should return barzahlen', () => {
    const apiBarzahlen = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .get('/api/barzahlen/branches')
      .query({
        nelat: 52.52207036136366,
        nelon: 13.391647338867186,
        swlat: 52.51120638909939,
        swlon: 13.3758544921875
      })
      .reply(200, [
        {
          id: 9818,
          lat: '52.520001',
          lng: '13.3908251',
          title: 'ADAMS',
          street_no: 'Georgenstr. 12',
          zipcode: '10117',
          city: 'Berlin',
          countrycode: 'DE',
          opening_hours: [
            {
              days: 'Mo-So',
              time: '06:00-22:00 Uhr'
            }
          ],
          phone: '03020058992',
          logo_url:
            'https://cdn.barzahlen.de/images/filialfinder/logo_adams.png',
          logo_thumbnail_url:
            'https://cdn.barzahlen.de/images/filialfinder/tn_adams.png',
          minutes_until_close: 47,
          offline_partner_id: '34154'
        }
      ]);

    return n26
      .barzahlen({
        nelat: 52.52207036136366,
        nelon: 13.391647338867186,
        swlat: 52.51120638909939,
        swlon: 13.3758544921875
      })
      .then(barzahlen => {
        expect(barzahlen).to.be.eql([
          {
            id: 9818,
            lat: '52.520001',
            lng: '13.3908251',
            title: 'ADAMS',
            street_no: 'Georgenstr. 12',
            zipcode: '10117',
            city: 'Berlin',
            countrycode: 'DE',
            opening_hours: [
              {
                days: 'Mo-So',
                time: '06:00-22:00 Uhr'
              }
            ],
            phone: '03020058992',
            logo_url:
              'https://cdn.barzahlen.de/images/filialfinder/logo_adams.png',
            logo_thumbnail_url:
              'https://cdn.barzahlen.de/images/filialfinder/tn_adams.png',
            minutes_until_close: 47,
            offline_partner_id: '34154'
          }
        ]);

        expect(apiBarzahlen.isDone()).to.be.true();
      });
  });
});
