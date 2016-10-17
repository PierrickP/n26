'use strict';
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const moment = require('moment');

const expect = chai.expect;

chai.use(dirtyChai);

const statsProperties = [
  'from',
  'to',
  'amount'
];

describe('Stats', () => {
  it('should return daily stats', () => {
    const from = moment().startOf('year');
    const to = moment().endOf('month');

    return global.n26.stats(from, to, 'weeks').then(stats => {
      stats.forEach(stat => {
        statsProperties.forEach(property => {
          expect(stat).to.have.deep.property(property);
        });
      });

      if (stats.length >= 2) {
        console.log(`\tStats: ${100 / (stats[stats.length - 2].amount / stats[stats.length - 1].amount) - 100} % since previous week`);
      }
    });
  });
});
