const nock = require('nock');

const number26 = require('../../index');

const data = require('./data');

module.exports = (cb) => {
  nock('https://api.tech26.de', {
    authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
  }).post('/oauth/token', {
    username: process.TEST_USERNAME || 'username@mail.com',
    password: process.TEST_PASSWORD || 'password',
    grant_type: 'password'
  }).reply(200, data);

  number26.auth(
    process.TEST_USERNAME || 'username@mail.com',
    process.TEST_PASSWORD || 'password',
    cb
  );
};
