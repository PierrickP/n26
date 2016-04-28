'use strict';
const Account = require('./account');
const api = require('./api');

module.exports = {
  /**
   * Authentification and return a new instance of number26
   *
   * @param {string} email      Customer Email
   * @param {string} password   Password
   *
   * @returns {Promise<Account>}
   */
  auth(email, password, cb) {
    return api.auth(email, password)
      .then((body) => new Account(body))
      .catch((err) => new Error(err))
      .asCallback(cb);
  }
};
