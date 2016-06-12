'use strict';
/* eslint-disable global-require, max-len, arrow-body-style */
const fs = require('fs');
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

describe('statement', () => {
  it('should return a base64 statement', () => {
    const apiStatements = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/json'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/statements/json/statement-2016-05')
      .reply(200, {
        id: 'statement-2016-05',
        pdf: fs.readFileSync(`${__dirname}/../fixtures/statement.pdf`).toString('base64')
      });

    return n26.statement('statement-2016-05').then((statement) => {
      expect(statement).to.have.property('id', 'statement-2016-05');
      expect(statement).to.have.property('type', 'base64');
      expect(statement).to.have.property('pdf').and.to.be.a('String');

      expect(apiStatements.isDone()).to.be.true();
    });
  });

  it('should return a buffer statement', () => {
    const apiStatements = nock('https://api.tech26.de')
      .defaultReplyHeaders({
        'Content-Type': 'application/pdf'
      })
      .matchHeader('Authorization', `Bearer ${data.access_token}`)
      .get('/api/statements/statement-2016-05')
      .reply(200, fs.readFileSync(`${__dirname}/../fixtures/statement.pdf`));

    return n26.statement('statement-2016-05', true).then((statement) => {
      expect(statement).to.have.property('id', 'statement-2016-05');
      expect(statement).to.have.property('type', 'pdf');
      expect(statement).to.have.property('pdf');
      expect(Buffer.isBuffer(statement.pdf)).to.be.true();

      expect(apiStatements.isDone()).to.be.true();
    });
  });

  it('should return error if no `id` is passed', () => {
    return n26.statement().catch((err) => {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.message).to.equal('MISSING_PARAMS');
    });
  });
});
