'use strict';

const Promise = require('bluebird');

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
    this.exceetExpressCardDelivery = card.exceetExpressCardDelivery;
    this.exceetExpressCardDeliveryEmailSent =
      card.exceetExpressCardDeliveryEmailSent;
    this.status = card.status;
    this.maskedPan = card.maskedPan;
    this.expirationDate = card.expirationDate;
    this.pinDefined = card.pinDefined;
    this.cardActivated = card.cardActivated;
    this.usernameOnCard = card.usernameOnCard;
    this.cardProduct = card.cardProduct;
    this.cardProductType = card.cardProductType;
    this.membership = card.membership;
    this.exceetActualDeliveryDate = card.exceetActualDeliveryDate;
    this.exceetCardStatus = card.exceetCardStatus;
    this.exceetExpectedDeliveryDate = card.exceetExpectedDeliveryDate;
    this.exceetExpressCardDeliveryTrackingId =
      card.exceetExpressCardDeliveryTrackingId;
    this.cardSettingsId = card.cardSettingsId;
    this.mptsCard = card.mptsCard;
  }

  /**
   * Get / set card limit
   *
   * @param {Object}   [limit]
   * @param {String}   limit.limit         Limit type
   * @param {Number}   [limit.amount]      Amount
   * @param {String[]} [limit.countryList] Array of country code
   *
   * @return {Promise<cardLimit[]>}
   */
  limits(limit) {
    return Promise.try(() => {
      if (limit) {
        if (
          !limit.limit ||
          (limit.limit === 'COUNTRY_LIST' && !limit.countryList) ||
          (limit.limit !== 'COUNTRY_LIST' && limit.amount === undefined)
        ) {
          throw new Error('BAD_PARAMS');
        }

        return utils.callApi(this.account, 'setCardLimits', {
          cardId: this.id,
          limit
        });
      }

      return utils.callApi(this.account, 'getCardLimits', this.id);
    });
  }

  /**
   * Block card
   *
   * @return {Promise}
   */
  block() {
    return utils.callApi(this.account, 'blockCard', this.id).tap(() => {
      this.status = /^M_/.test(this.status) ? 'M_DISABLED' : 'BLOCKED';
    });
  }

  /**
   * Unblock card
   *
   * @return {Promise}
   */
  unblock() {
    return utils.callApi(this.account, 'unblockCard', this.id).tap(() => {
      this.status = /^M_/.test(this.status) ? 'M_ACTIVE' : 'OPEN';
    });
  }
}

module.exports = Card;
