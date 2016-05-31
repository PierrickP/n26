'use strict';
const api = require('./api');

/**
 * CallApi
 *
 * @private
 *
 * @param  {Account} account
 * @param  {String}  method   Api method to call
 */
function callApi(account, method, data) {
  const now = +new Date() / 1000;

  if (account) {
    if (account.logged === false || (now - account.createdAt) >= account.expiresIn) {
      account.logged = false; // todo eslint
      return account.auth().then(() => api[method](account.accessToken, data));
    }

    return api[method](account.accessToken, data);
  }

  return api[method](data);
}

module.exports = {
  callApi
};
