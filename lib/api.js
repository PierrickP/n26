'use strict';
const request = require('request-promise');

const api = 'https://api.tech26.de';

function errorHandler(err) {
  throw (err && err.error && err.error !== '') ? err.error : err.statusCode;
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

  getMe(token) {
    return request({
      method: 'GET',
      url: `${api}/api/me`,
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
  }
};
