'use strict';

const utils = require('./utils');

/**
 * @typedef cardLimit
 *
 * @property {String}   limit         Limit type
 * @property {Number}   [amount]      Amount
 * @property {String[]} [countryList] Array of country code
 */

/**
 * Card instance
 * linked to an account. An account should contains many card.
 */
class Card {
  constructor(account, card) {
    this.account = account;
    this.id = card.id;
    this.cardType = card.cardType;
    this.n26Status = card.n26Status;
    this.maskedPan = card.maskedPan;
    this.expirationDate = card.expirationDate;
    this.pinDefined = card.pinDefined;
    this.cardActivated = card.cardActivated;
    this.usernameOnCard = card.usernameOnCard;
  }

  /**
   * Get card limit
   *
   * @return {Promise<cardLimit[]>}
   */
  limits() {
    return utils.callApi(this.account, 'getCardLimits', this.id);
  }
}

module.exports = Card;

