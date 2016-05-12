'use strict';
const Account = require('./account');

/**
 * Authentification and return a new instance of number26
 *
 * @param {string} email      Customer Email
 * @param {string} password   Password
 *
 * @returns {Promise<Account>}
 */
module.exports = (email, password) => new Account(email, password).auth();
