'use strict';
/* eslint-disable global-require, max-len, no-console, arrow-body-style */

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const N26 = require('../../index');

chai.use(dirtyChai);

const barzahlenProperties = [
  'depositAllowance',
  'withdrawAllowance',
  'remainingAmountMonth',
  'feeRate',
  'cash26WithdrawalsCount',
  'cash26WithdrawalsSum',
  'atmWithdrawalsCount',
  'atmWithdrawalsSum',
  'monthlyDepositFeeThreshold',
  'success'
];
const barzahlenBranchesProperties = [
  'id',
  'lat',
  'lng',
  'title',
  'street_no',
  'zipcode',
  'city',
  'countrycode',
  'opening_hours',
  'logo_url',
  'logo_thumbnail_url',
  'minutes_until_close',
  'offline_partner_id'
];

describe('Barzahlen', () => {
  it('should check barzahlen', () => {
    return global.n26.barzahlen()
      .then((barzahlen) => {
        barzahlenProperties.forEach(property => {
          expect(barzahlen).to.have.deep.property(property);
        });

        console.log(`\tBarzahlen: ${barzahlen.depositAllowance} € deposit allowed`);
      });
  });

  it('should get barzahlen', () => {
    return N26.barzahlen({
      nelat: 52.6078,
      nelon: 13.5338,
      swlat: 52.4165,
      swlon: 13.2688
    })
    .then((barzahlenBranches) => {
      barzahlenBranches.forEach((branch) => {
        barzahlenBranchesProperties.forEach(property => {
          expect(branch).to.have.deep.property(property);
        });
      });

      console.log(`\tBarzahlen: ${barzahlenBranches.length} places in this zone`);
    });
  });
});
