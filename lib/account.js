'use strict';
const Promise = require('bluebird');

const api = require('./api');

/**
 * @typedef  account
 *
 * @property {String} id
 * @property {String} iban             Account IBAN
 * @property {String} status           Status of the account
 * @property {number} usableBalance    Usable balance
 * @property {number} availableBalance Available balance
 * @property {number} bankBalance      Bank balance
 */

/**
 * @typedef  addresses
 *
 * @property {objet}    paging
 * @property {number}   paging.totalResults    Total amount of addresses
 * @property {Object[]} data
 * @property {String}   data.id
 * @property {String}   data.type              Type address
 * @property {String}   data.addressLine1      Address line 1
 * @property {String}   data.streetName        Street name
 * @property {String}   data.houseNumberBlock  Street Number
 * @property {String}   data.zipCode           Zip code
 * @property {String}   data.cityName          City
 * @property {String}   data.countryName       Country
 */

/**
 * @typedef  cards
 *
 * @property {objet}    paging
 * @property {number}   paging.totalResults     Total amount of addresses
 * @property {Object[]} data
 * @property {String}   data.id
 * @property {String}   data.cardType           Card type
 * @property {String}   data.n26Status          Card status
 * @property {String}   data.maskedPan          Number card (masked)
 * @property {String}   data.expirationDate     Expiration date
 * @property {String}   data.pinDefined
 * @property {String}   data.cardActivated
 * @property {String}   data.usernameOnCard     Name on the card
 */

/**
 * @typedef  me
 *
 * @property {String} id
 * @property {String} birthDate         Birth date
 * @property {String} birthPlace        Birth place
 * @property {String} email             Email
 * @property {String} gender            Gender
 * @property {String} title             Title (eg: Ph.)
 * @property {String} firstName         Firstname
 * @property {String} lastName          Lastname
 * @property {String} kycFirstName      Firstname on KYC
 * @property {String} kycLastName       Lastname on KYC
 * @property {String} mobilePhoneNumber Mobile phone number
 * @property {String} nationality       Nationality
 * @property {String} passwordHash
 * @property {String} shadowID
 * @property {String} signupCompleted
 * @property {String} taxIDRequired
 */

/**
 * @typedef  recipients
 *
 * @property {String} iban
 * @property {String} name
 * @property {String} bic
 */

/**
 * @typedef  transactions
 *
 * @property {String} id
 * @property {String} type
 * @property {String} smartLinkId
 * @property {String} amount
 * @property {String} currencyCode
 * @property {String} originalAmount
 * @property {String} originalCurrency
 * @property {String} exchangeRate
 * @property {String} merchantCity
 * @property {String} visibleTS
 * @property {String} mcc
 * @property {String} mccGroup
 * @property {String} merchantName
 * @property {String} merchantId
 * @property {String} recurring
 * @property {String} userId
 * @property {String} linkId
 * @property {String} accountId
 * @property {String} category
 * @property {String} cardId
 * @property {String} pending
 * @property {String} transactionNature
 * @property {String} partnerAccountIsSepa
 * @property {String} partnerName
 * @property {String} partnerIban
 * @property {String} referenceText
 * @property {String} userCertified
 * @property {String} smartContactId
 * @property {String} partnerBic
 * @property {String} confirmed
 */

/**
 * @typedef transfer
 *
 * @property {String}  id
 * @property {String}  n26Iban
 * @property {String}  referenceText
 * @property {String}  partnerName
 * @property {String}  partnerIban
 * @property {String}  partnerBic
 * @property {Boolean} partnerAccountIsSepa
 * @property {Number}  amount
 * @property {String}  currencyCode
 * @property {String}  linkId
 * @property {String}  recurring
 * @property {String}  visibleTS
 */

/**
 * Number26 Account
 */
class Account {
  /**
   * Create new account instance
   *
   * @param  {Object} auth Object from auth()
   */
  constructor(auth) {
    this.createAt = +new Date();
    this.accessToken = auth.access_token;
    this.expiresIn = auth.expires_in;
    this.jti = auth.jti;
    this.scope = auth.scope;
    this.tokenType = auth.token_type;
  }

  /**
   * Get account details
   *
   * @returns {Promise<account>}
   */
  account(cb) {
    return api.getAccount(this.accessToken).asCallback(cb);
  }

  /**
   * Get addresses
   *
   * @return {Promise<addresses>}
   */
  addresses(cb) {
    return api.getAddresses(this.accessToken).asCallback(cb);
  }

  /**
   * Get cards
   *
   * @return {Promise<cards>}
   */
  cards(cb) {
    return api.getCards(this.accessToken).asCallback(cb);
  }

  /**
   * Get information about current user
   *
   * @return {Promise<me>}
   */
  me(cb) {
    return api.getMe(this.accessToken).asCallback(cb);
  }

  /**
   * Create or update Meme
   *
   * @param {String} transaction Transaction ID
   * @param {String} memo        Memo text
   */
  memo(transaction, memo, cb) {
    return api.createOrUpdateMemo(this.accessToken, transaction, memo).asCallback(cb);
  }

  /**
   * Get recipients
   *
   * @return {Promise<recipients[]>}
   */
  recipients(cb) {
    return api.getRecipients(this.accessToken).asCallback(cb);
  }

  /**
   * Get transactions
   *
   * @param  {Object}   [options]
   * @param  {Number}   [options.limit]         Limit results
   * @param  {String[]} [options.categories]    Filter by categories
   * @param  {Number}   [options.from]          "From" timestamp limit
   * @param  {Number}   [options.to]            "To" timestamp limit
   * @param  {String}   [options.text]          Text search
   * @param  {String}   [options.pending=false] Pending transaction
   *
   * @return {Promise<transactions[]>}
   */
  transactions(options, cb) {
    return api.getTransactions(this.accessToken, options).asCallback(cb);
  }

  /**
   * Create transfer
   *
   * @param  {Object}        data
   * @param  {Number|String} data.pin        Credit card pin
   * @param  {String}        data.bic        BIC recipient
   * @param  {String}        data.iban       IBAN recipient
   * @param  {String}        data.name       Recipient name
   * @param  {Number}        data.amount     Amount
   * @param  {String}        data.reference  Reference
   *
   * @return {Promise<transfer>}
   */
  transfer(data, cb) {
    if (!data.pin || !data.iban || !data.bic || !data.amount || !data.name || !data.reference) {
      return new Promise.reject('MISSING_PARAMS').asCallback(cb); // eslint-disable-line new-cap
    }

    if (data.reference.length > 135) {
      return new Promise.reject('REFERENCE_TOO_LONG').asCallback(cb); // eslint-disable-line new-cap
    }

    return api.createTransfer(this.accessToken, data).asCallback(cb);
  }
}

module.exports = Account;
