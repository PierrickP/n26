const nock = require('nock');

const N26 = require('../../index');

const data = require('./data');

module.exports = cb => {
  nock('https://api.tech26.de', {
    authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0'
  })
    .post('/oauth/token', {
      username: 'username@mail.com',
      password: 'password',
      grant_type: 'password'
    })
    .reply(200, data.account);

  return new N26('username@mail.com', 'password').asCallback(cb);
};
