'use strict';
const moment = require('moment');
const Promise = require('bluebird');

const Card = require('./card.js');

const api = require('./api');
const utils = require('./utils');

/**
 * @typedef Promise
 *
 * Bluebird promise
 * See http://bluebirdjs.com/docs/api-reference.html for references
 */

/**
 * @typedef  account
 *
 * @property {String}  id
 * @property {String}  iban             Account IBAN
 * @property {String}  bic              BIC
 * @property {number}  usableBalance    Usable balance
 * @property {number}  availableBalance Available balance
 * @property {number}  bankBalance      Bank balance
 * @property {String}  bankName         Bank name
 * @property {Boolean} seized
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
 * @property {objet}  paging
 * @property {number} paging.totalResults     Total amount of addresses
 * @property {Card[]} data
 */

/**
 * @typedef  me
 *
 * @property {String} id
 * @property {String} birthDate         Birth date
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
 * @property {String} cardName
 * @property {String} transferWiseTermsAccepted
 */

/**
 * @typedef statuses
 *
 * @property {Number}        singleStepSignup
 * @property {Number}        emailValidationInitiated
 * @property {Number}        emailValidationCompleted
 * @property {Number}        phonePairingInitiated
 * @property {Number}        phonePairingCompleted
 * @property {Number}        kycInitiated
 * @property {Number}        kycCompleted
 * @property {Number}        kycWebIDInitiated
 * @property {Number}        kycWebIDCompleted
 * @property {Number}        cardActivationCompleted
 * @property {Number}        cardIssued
 * @property {Number}        pinDefinitionCompleted
 * @property {Number}        bankAccountCreationInitiated
 * @property {Number}        bankAccountCreationSucceded
 * @property {Number}        firstIncomingTransaction
 * @property {String}        smsVerificationCode
 * @property {Number}        unpairTokenCreation
 * @property {Number|String} finoIntegrationStatus='NEVER'
 * @property {Number}        id
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
 * @typedef  transaction
 *
 * @property {String}   id
 * @property {String}   type
 * @property {String}   smartLinkId
 * @property {String}   amount
 * @property {String}   currencyCode
 * @property {String}   originalAmount
 * @property {String}   originalCurrency
 * @property {String}   exchangeRate
 * @property {String}   merchantCity
 * @property {String}   visibleTS
 * @property {String}   mcc
 * @property {String}   mccGroup
 * @property {String}   merchantName
 * @property {String}   merchantId
 * @property {String}   recurring
 * @property {String}   userId
 * @property {String}   linkId
 * @property {String}   accountId
 * @property {String}   category
 * @property {String}   cardId
 * @property {String}   pending
 * @property {String}   transactionNature
 * @property {String}   partnerAccountIsSepa
 * @property {String}   partnerName
 * @property {String}   partnerIban
 * @property {String}   referenceText
 * @property {String}   userCertified
 * @property {String}   smartContactId
 * @property {String}   partnerBic
 * @property {String}   confirmed
 * @property {String[]} tags
 * @property {Object}   [meta]
 * @property {String}   [meta.memo]
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
 * @typedef invitation
 *
 * @property {String} invited Invited email
 * @property {String} status  Current status
 * @property {Number} reward  Reward amount
 * @property {Number} created Timestamp
 */

/**
 * @typedef barzahlen
 *
 * @property {String}  depositAllowance
 * @property {String}  withdrawAllowance
 * @property {String}  remainingAmountMonth
 * @property {String}  feeRate
 * @property {String}  cash26WithdrawalsCount
 * @property {String}  cash26WithdrawalsSum
 * @property {String}  atmWithdrawalsCount
 * @property {String}  atmWithdrawalsSum
 * @property {String}  monthlyDepositFeeThreshold
 * @property {Boolean} success
 */

/**
 * @typedef statement
 *
 * @property {String}        id
 * @property {String}        type `pdf` for pdf buffer or `base64` for pdf in base64
 * @property {Buffer|String} pdf  PDF encoded
 */

/**
 * @typedef statements
 *
 * @property {String}  id
 * @property {String}  url
 * @property {Number}  month
 * @property {Number}  visibleTS
 * @property {Number}  year
 */

/**
 * @typedef contact
 *
 * @property {String} id
 * @property {String} name
 * @property {String} subtitle
 * @property {Object} account
 * @property {String} account.accountType
 * @property {String} account.iban
 * @property {String} account.bic
 */

/**
 * @typedef limit
 *
 * @property {String} limit  Limit type, can be ATM_DAILY_ACCOUNT or POS_DAILY_ACCOUNT
 * @property {Number} amount
 */

/**
 * @typedef category
 *
 * @property {String} id
 * @property {String} base64Image PNG base64 encoded
 * @property {String} name        Translated category name
 */

/**
 * @typedef csv
 *
 * @description CSV file with "," delimiter
 */

/**
 * @typedef pair
 *
 * @property {String} privateKey RSA private key
 * @property {String} publicKey  Public key
 * @property {String} pkp        Random generated string
 */

/**
 * N26 Account
 */
class Account {
  /**
   * Create new account instance
   *
   * @param  {Object} auth Object from auth()
   */
  constructor(email, password) {
    this.logged = false;
    this.email = email;
    this.password = password;
    this.createdAt = null;
    this.accessToken = null;
    this.expiresIn = null;
    this.jti = null;
    this.scope = [];
    this.tokenType = null;
  }

  /**
   * authentication
   *
   * @returns {Promise<Account>}
   */
  auth() {
    return api.auth(this.email, this.password)
      .bind(this)
      .then(auth => {
        this.logged = true;
        this.createdAt = +new Date() / 1000;
        this.accessToken = auth.access_token;
        this.expiresIn = auth.expires_in;
        this.jti = auth.jti;
        this.scope = auth.scope.split(' ');
        this.tokenType = auth.token_type;

        return this;
      });
  }

  /**
   * Get account details
   *
   * @returns {Promise<account>}
   */
  account() {
    return utils.callApi(this, 'getAccount');
  }

  /**
   * Get addresses
   *
   * @return {Promise<addresses>}
   */
  addresses() {
    return utils.callApi(this, 'getAddresses');
  }

  /**
   * Check barzahlen
   *
   * @return {Promise<barzahlen>}
   */
  barzahlen() {
    return utils.callApi(this, 'checkBarzahlen');
  }

  /**
   * Get transaction categories
   *
   * @return {Promise<category[]>}
   */
  categories() {
    return utils.callApi(this, 'getCategories');
  }

  /**
   * Get one specific or all cards
   *
   * @param  {String} [cardId] Card Id - Don't use, some info like `status` is missing
   *
   * @return {Promise<Card>|Promise<cards>}
   */
  cards(cardId) {
    if (cardId) {
      return utils.callApi(this, 'getCard', cardId)
        .then(card => new Card(this, card));
    }

    return utils.callApi(this, 'getCards')
      .then(cards => cards.map(card => new Card(this, card)));
  }

  /**
   * Get transactions CSV
   *
   * @param  {Date|Number} from       From date
   * @param  {Date|Number} [to=now()] To date
   *
   * @return {Promise<csv>}
   */
  csv(from, to) {
    return Promise.try(() => {
      if (!from) {
        throw new Error('MISSING_PARAMS');
      }

      from = ((from instanceof Date) ? from.getTime() : from);
      to = ((to instanceof Date) ? to.getTime() : to || new Date().getTime());
      return utils.callApi(this, 'getCSV', {from, to});
    });
  }

  /**
   * Get contacts
   *
   * @return {Promise<contact[]>}
   */
  contacts() {
    return utils.callApi(this, 'getContacts');
  }

  /**
   * Get / send invitations emails
   *
   * @param  {String|String[]}                [emails] Emails to send an invitation
   *
   * @return {Promise|Promise<invitation[]>}
   */
  invitations(emails) {
    if (emails) {
      emails = Array.isArray(emails) ? emails : [emails];
      return Promise.each(emails, email => utils.callApi(this, 'sendInvitations', email));
    }

    return utils.callApi(this, 'getInvitations');
  }

  /**
   * Get / Set limits
   *
   * @param  {Object} [limits]
   * @param  {Number} [limits.atm] Set daily limit for ATM withdraw
   * @param  {Number} [limits.pos] Set daily limit for POS payment
   *
   * @return {Promise|Promise<limit[]>}
   */
  limits(limits) {
    function validateAmount(amount, max) {
      if (!Number.isInteger(amount) || amount < 0 || amount > max) {
        return false;
      }

      return true;
    }

    return Promise.try(() => {
      if (limits) {
        const calls = [];

        if (limits.atm !== undefined) {
          if (!validateAmount(limits.atm, 2500)) {
            throw new Error('Limits should be between 0 and 2500');
          }

          calls.push(utils.callApi(this, 'setLimits', {
            limit: 'ATM_DAILY_ACCOUNT',
            amount: limits.atm
          }));
        }

        if (limits.pos !== undefined) {
          if (!validateAmount(limits.pos, 5000)) {
            throw new Error('Limits should be between 0 and 5000');
          }

          calls.push(utils.callApi(this, 'setLimits', {
            limit: 'POS_DAILY_ACCOUNT',
            amount: limits.pos
          }));
        }

        return Promise.all(calls);
      }

      return utils.callApi(this, 'getLimits');
    });
  }

  /**
   * Get information about current user
   *
   * @param {Boolean} full Return full informations
   *
   * @return {Promise<me>}
   */
  me(full) {
    return utils.callApi(this, 'getMe', {full: !!full});
  }

  /**
   * Create or update Meme
   *
   * @param {String} smartLinkId SmartLinkId
   * @param {String} memo        Memo text
   */
  memo(smartLinkId, memo) {
    return utils.callApi(this, 'getTransactionMeta', smartLinkId)
      .then(meta => utils.callApi(this, 'createOrUpdateMemo', {smartLinkId, meta, memo}));
  }

  /**
   * Get statement
   *
   * @description Return pdf buffer or base64 encoded
   *
   * @return {Promise<statement>}
   */
  statement(id, pdf) {
    return Promise.try(() => {
      pdf = !!pdf;
      if (!id) {
        throw new Error('MISSING_PARAMS');
      }

      return utils.callApi(this, 'getStatement', {id, pdf})
      .then(result => ({
        id,
        type: (pdf) ? 'pdf' : 'base64',
        pdf: (pdf) ? new Buffer(result, 'binary') : result.pdf
      }));
    });
  }

  /**
   * Get statements
   *
   * @return {Promise<statements[]>}
   */
  statements() {
    return utils.callApi(this, 'getStatements');
  }

  /**
   * Get statuses
   *
   * Return many timestamps about this account
   *
   * @return {Promise<statuses>}
   */
  statuses() {
    return utils.callApi(this, 'getStatuses');
  }

  /**
   * Get stats
   *
   * @param  {Date|Number} from     From date (native date or timestamp)
   * @param  {Date|Number} to       To date (native date or timestamp)
   * @param  {String}      interval Interval data per "days" / "weeks" / "months" / "years"
   *
   */
  stats(from, to, interval) {
    return Promise.try(() => {
      if (!from || !to || !interval) {
        throw new Error('MISSING_PARAMS');
      }

      if (['days', 'weeks', 'months', 'years'].indexOf(interval) === -1) {
        throw new Error('BAD_PARAMS');
      }

      const request = [];

      from = moment((from instanceof Date) ? from.getTime() / 1000 : from, 'X').startOf(interval);
      to = moment((to instanceof Date) ? to.getTime() / 1000 : to, 'X').endOf(interval);

      while (from < to) {
        const tempTo = moment(from).add(1, interval).endOf(interval);

        request.push(utils.callApi(this, 'getStats', {
          from: from.valueOf(),
          to: tempTo.valueOf()
        }));

        from.add(1, interval);
      }

      return Promise.map(request, slices => {
        const slice = slices.slices[0];
        return {
          from: slice.from,
          to: slice.to,
          amount: slice.ammount
        };
      });
    });
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
  transactions(options) {
    return utils.callApi(this, 'getTransactions', options || {});
  }

  /**
   * Get transaction detail
   *
   * @param  {String}  id            Transaction number
   * @param  {Object}  options
   * @param  {Boolean} options.meta  With meta
   *
   * @return {Promise<transaction>}
   */
  transaction(id, options) {
    return Promise.try(() => {
      if (!id) {
        throw new Error('MISSING_PARAMS');
      }

      const data = {id};

      if (options && options.meta) {
        data.meta = options.meta;
      }

      return utils.callApi(this, 'getTransaction', data);
    });
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
  transfer(data) {
    return Promise.try(() => {
      if (!data.pin || !data.iban || !data.bic || !data.amount || !data.name || !data.reference) {
        throw new Error('MISSING_PARAMS');
      }

      if (data.reference.length > 135) {
        throw new Error('REFERENCE_TOO_LONG');
      }

      return utils.callApi(this, 'createTransfer', data);
    });
  }

  transferCertify(transactionId, privateKey) {
    return utils.callApi(this, 'getTransactionTan', transactionId)
      .then(tanId => utils.callApi(this, 'getEncryptedTan', tanId))
      .then(tan => utils.callApi(this, 'certifyTransaction', {transactionId, tan, privateKey}));
  }

  /**
   * Init pair device
   *
   * Init pair process. Will receive an sms.
   *
   * @return {Promise}
   */
  pairInit() {
    return utils.callApi(this, 'pairInit');
  }

  /**
   * Confirm pair device
   *
   * Finish pair process by sending public RSA key & randomstring
   *
   * @param  {Number} pin
   *
   * @return {Promise<pair>}
   */
  pairConfirm(pin) {
    return Promise.try(() => {
      const that = this;

      if (!pin) {
        throw new Error('MISSING_PARAMS');
      }

      return utils.callApi(that, 'pairConfirm', pin);
    });
  }

  /**
   * Init unpair device
   *
   * Init unpair process. Will receive an email (ignore it) + sms.
   *
   * @param  {Number} pin
   * @param  {Number} cardNumber The 10 digits on the card, below name
   *
   * @return {Promise}
   */
  unpairInit(pin, cardNumber) {
    return Promise.try(() => {
      const that = this;

      if (!pin || !cardNumber) {
        throw new Error('MISSING_PARAMS');
      }

      return utils.callApi(that, 'unpairUpstart')
        .then(link => utils.callApi(that, 'unpairVerify', link))
        .then(() => utils.callApi(that, 'unpairValidationPin', pin))
        .then(() => utils.callApi(that, 'unpairValidationCard', cardNumber))
        .then(() => utils.callApi(that, 'unpairValidationSms'));
    });
  }

  /**
   * Confirm unpairing
   *
   * Confirm unpairing
   * Use the number on the sms message.
   *
   * @param  {Number} smsNumber The 5 digits received on the phone
   *
   * @return {Promise}
   */
  unpairConfirm(smsNumber) {
    return Promise.try(() => {
      if (!smsNumber) {
        throw new Error('MISSING_PARAMS');
      }

      return utils.callApi(this, 'unpairValidationSmsVerify', smsNumber);
    });
  }
}

module.exports = Account;
