'use strict';
const request = require('request-promise');

const api = 'https://api.tech26.de';

function errorHandler(err) {
  err = (err && err.error && err.error !== '') ? err.error : err;
  err = (err.statusCode) ? err.statusCode : err;
  throw err;
}

module.exports = {
  createOrUpdateMemo(token, opts) {
    function getMetaData() {
      return request.get({
        method: 'GET',
        url: `${api}/api/transactions/${opts.transaction}/metadata`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    function createOrUpdate(meta) {
      return request({
        method: (meta === '') ? 'POST' : 'PUT',
        url: `${api}/api/transactions/${opts.transaction}`,
        form: {
          memo: opts.memo
        },
        json: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return getMetaData()
      .then(createOrUpdate)
      .catch(errorHandler);
  },

  auth(username, password) {
    return request({
      method: 'POST',
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

  createTransfer(token, data) {
    return request({
      method: 'POST',
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

  getAccount(token) {
    return request({
      method: 'GET',
      url: `${api}/api/accounts`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getAddresses(token) {
    return request({
      method: 'GET',
      url: `${api}/api/addresses`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getCards(token) {
    return request({
      method: 'GET',
      url: `${api}/api/cards`,
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

    return request({
      method: 'GET',
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
    return request({
      method: 'GET',
      url: `${api}/api/transactions/recipients`,
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

    return request({
      method: 'GET',
      url: `${api}/api/smrt/transactions`,
      qs,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  getTransaction(token, id) {
    return request({
      method: 'GET',
      url: `${api}/api/smrt/transactions/${id}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  },

  unpairUpstart(token) {
    return request({
      method: 'POST',
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
    return request({
      method: 'POST',
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
    return request({
      method: 'POST',
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
    return request({
      method: 'POST',
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
    return request({
      method: 'POST',
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
    return request({
      method: 'POST',
      url: `${api}/api/unpair/validation/sms/verify/${smsNumber}`,
      json: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .catch(errorHandler);
  }
};
