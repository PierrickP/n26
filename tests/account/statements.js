'use strict';
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

describe('statements', () => {
  const dataStatements = [{
    id: 'statement-2016-05',
    month: 5,
    url: '/api/statements/statement-2016-05',
    visibleTS: 1464652800000,
    year: 2016
  }];

  it('should return statements', () => {
    const apiStatements = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.account.access_token}`)
      .get('/api/statements')
      .reply(200, dataStatements);

    return n26.statements().then((statements) => {
      expect(statements).to.be.eql(dataStatements);

      expect(apiStatements.isDone()).to.be.true();
    });
  });
});
