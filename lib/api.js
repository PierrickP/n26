'use strict';
const request = require('request-promise');

const api = 'https://api.tech26.de';

function errorHandler(err) {
  err = (err && err.error && err.error !== '') ? err.error : err;
  err = (err.statusCode) ? err.statusCode : err;
  throw err;
}

module.exports = {
  auth(username, password) {
    return request.post({
      url: `${api}/oauth/token`,
      form: {
        username,
        password,
        grant_type: 'password'
      },
      json: true,
      headers: {
        Authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36' // eslint-disable-line max-len
      }
    })
    .catch(errorHandler);
  },

  blockCard(token, cardId) {
    return request.post({
      url: `${api}/api/cards/${cardId}/block`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  unblockCard(token, cardId) {
    return request.post({
      url: `${api}/api/cards/${cardId}/unblock`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  checkBarzahlen(token) {
    return request.get({
      url: `${api}/api/barzahlen/check`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  createTransfer(token, data) {
    return request.post({
      url: `${api}/api/transactions`,
      json: {
        pin: String(data.pin),
        transaction: {
          partnerBic: data.bic,
          amount: data.amount,
          type: 'DT',
          partnerIban: data.iban,
          partnerName: data.name,
          referenceText: data.reference
        }
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  createOrUpdateMemo(token, opts) {
    return request({
      method: (opts.meta && opts.meta.memo) ? 'PUT' : 'POST',
      url: `${api}/api/transactions/${opts.smartLinkId}/memo`,
      json: {
        memo: opts.memo
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getAccount(token) {
    return request.get({
      url: `${api}/api/accounts`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getAddresses(token) {
    return request.get({
      url: `${api}/api/addresses`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getBarzahlen(coords) {
    return request.get({
      url: `${api}/api/barzahlen/branches`,
      json: true,
      qs: coords
    })
    .catch(errorHandler);
  },

  getCategories(token) {
    return request.get({
      url: `${api}/api/smrt/categories`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getCard(token, cardId) {
    return request.get({
      url: `${api}/api/cards/${cardId}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getCards(token) {
    return request.get({
      url: `${api}/api/cards`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getCardLimits(token, cardId) {
    return request.get({
      url: `${api}/api/settings/limits/${cardId}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  setCardLimits(token, opt) {
    return request.put({
      url: `${api}/api/settings/limits/${opt.cardId}`,
      json: opt.limit,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getContacts(token) {
    return request.get({
      url: `${api}/api/smrt/contacts`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getCSV(token, opts) {
    return request.get({
      url: `${api}/api/smrt/reports/${opts.from}/${opts.to}/statements`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getLimits(token) {
    return request.get({
      url: `${api}/api/settings/account/limits`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getMe(token, options) {
    const qs = {};
    if (options.full) {
      qs.full = options.full;
    }

    return request.get({
      url: `${api}/api/me`,
      qs,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getRecipients(token) {
    return request.get({
      url: `${api}/api/transactions/recipients`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getStatement(token, options) {
    return request.get({
      url: `${api}/api/statements/${(options.pdf) ? '' : 'json/'}${options.id}`,
      json: !options.pdf,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getStatements(token) {
    return request.get({
      url: `${api}/api/statements`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getStatuses(token) {
    return request.get({
      url: `${api}/api/me/statuses`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getTransactions(token, options) {
    const qs = {
      limit: options.limit || 50,
      pending: options.pending || false
    };

    if (options.categories) {
      qs.categories = options.categories.join(',');
    }

    if (options.from && options.to) {
      qs.from = options.from;
      qs.to = options.to;
    }

    if (options.text) {
      qs.textFilter = options.text;
    }

    return request.get({
      url: `${api}/api/smrt/transactions`,
      qs,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getTransaction(token, opts) {
    const that = this;

    return request.get({
      url: `${api}/api/smrt/transactions/${opts.id}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((transaction) => {
      if (!opts.meta) {
        return transaction;
      }

      return that.getTransactionMeta(token, transaction.smartLinkId)
        .then((meta) => {
          transaction.meta = meta;
          return transaction;
        });
    })
    .catch(errorHandler);
  },

  getTransactionMeta(token, smartLinkId) {
    return request.get({
      url: `${api}/api/transactions/${smartLinkId}/metadata`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  /*
    Invitations
   */

  sendInvitations(token, email) {
    return request.post({
      url: `${api}/api/aff/invite`,
      json: {
        email
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  getInvitations(token) {
    return request.get({
      url: `${api}/api/aff/invitations`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  setLimits(token, limits) {
    return request.post({
      url: `${api}/api/settings/account/limits`,
      json: limits,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  /*
    Pairing / unpairing
   */

  unpairUpstart(token) {
    return request.post({
      url: `${api}/api/unpair/uppstart`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(body => {
      if (!body.success) {
        throw body.message;
      }

      return body.message.replace('https://my.number26.de/unpair/', '');
    })
    .catch(errorHandler);
  },

  unpairVerify(token, unpairToken) {
    return request.post({
      url: `${api}/api/unpair/verify/${unpairToken}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(body => {
      if (!body.success) {
        throw body;
      }

      return body;
    })
    .catch(errorHandler);
  },

  unpairValidationPin(token, pin) {
    return request.post({
      url: `${api}/api/unpair/validation/pin`,
      json: {
        pin
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(body => {
      if (!body.success) {
        throw body;
      }

      return body;
    })
    .catch(errorHandler);
  },

  unpairValidationCard(token, cardNumber) {
    return request.post({
      url: `${api}/api/unpair/validation/card/${cardNumber}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(body => {
      if (!body.success) {
        throw body;
      }

      return body;
    })
    .catch(errorHandler);
  },

  unpairValidationSms(token) {
    return request.post({
      url: `${api}/api/unpair/validation/sms/send`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(body => {
      if (!body.success) {
        throw body;
      }

      return body;
    })
    .catch(errorHandler);
  },

  unpairValidationSmsVerify(token, smsNumber) {
    return request.post({
      url: `${api}/api/unpair/validation/sms/verify/${smsNumber}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  }
};
