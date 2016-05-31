'use strict';
const Promise = require('bluebird');
const Account = require('./account');
const utils = require('./utils');

/**
 * @typedef barzahlen
 *
 * @param {Number}   id
 * @param {String}   lat
 * @param {String}   lng
 * @param {String}   title
 * @param {String}   street_no
 * @param {String}   zipcode
 * @param {String}   city
 * @param {String}   countrycode
 * @param {Object[]} opening_hours
 * @param {String}   opening_hours.days
 * @param {String}   opening_hours.time
 * @param {String}   phone
 * @param {String}   logo_url
 * @param {String}   logo_thunbnail_url
 * @param {Number}   minutes_until_close
 * @param {String}   offline_partner_id
 */

class number26 {
  /**
   * Authentification and return a new Account instance
   *
   * @param {string} email      Customer Email
   * @param {string} password   Password
   *
   * @returns {Promise<Account>}
   */
  constructor(email, password) {
    return new Account(email, password).auth();
  }

  /**
   * Barzahlen
   *
   * @description Return deposite / withdraw local service
   *
   * @param  {Object} coords
   * @param  {Number} coords.nelat NorthEast lat
   * @param  {Number} coords.nelon NorthEast lng
   * @param  {Number} coords.swlat SouthWest lat
   * @param  {Number} coords.swlon SouthWest lng
   *
   * @return {Promise<barzahlen[]>}
   */
  static barzahlen(coords) {
    if (!coords.nelat || !coords.nelon || !coords.swlat || !coords.swlon) {
      return Promise.reject('MISSING_PARAMS');
    }

    return utils.callApi(false, 'getBarzahlen', coords);
  }
}

module.exports = number26;
