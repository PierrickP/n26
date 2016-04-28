'use strict';
const request = require('request-promise');

const api = 'https://api.tech26.de';

function errorHandler(err) {
  if (err && err.error && err.error !== '') {
    throw (typeof err.error === 'object') ? err.error : JSON.parse(err.error);
  } else {
    throw err.statusCode;
  }
}

module.exports = {
  createOrUpdateMemo(token, transactionId, memo) {
    function getMetaData() {
      return request.get({
        method: 'GET',
        url: `${api}/api/transactions/${transactionId}/metadata`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    function createOrUpdate(meta) {
      return request({
        method: (meta === '') ? 'POST' : 'PUT',
        url: `${api}/api/transactions/${transactionId}`,
        form: {
          memo
        },
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
      headers: {
        Authorization: 'Basic bXktdHJ1c3RlZC13ZHBDbGllbnQ6c2VjcmV0',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36' // eslint-disable-line max-len
      }
    })
    .then((body) => JSON.parse(body))
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
    .then((body) => body)
    .catch(errorHandler);
  },

  getAccount(token) {
    return request({
      method: 'GET',
      url: `${api}/api/accounts`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  },

  getAddresses(token) {
    return request({
      method: 'GET',
      url: `${api}/api/addresses`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  },

  getCards(token) {
    return request({
      method: 'GET',
      url: `${api}/api/cards`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  },

  getMe(token) {
    return request({
      method: 'GET',
      url: `${api}/api/me`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  },

  getRecipients(token) {
    return request({
      method: 'GET',
      url: `${api}/api/transactions/recipients`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  },

  getTransactions(token, options) {
    const qs = {limit: options.limit || 50};

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
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((body) => JSON.parse(body))
    .catch(errorHandler);
  }
};
