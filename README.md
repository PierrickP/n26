# N26 :credit_card:

:warning: [number26 was renamed to *n26*](https://n26.com/number26-is-n26/)

[![npm](https://img.shields.io/npm/v/n26.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/n26) [![Travis branch](https://img.shields.io/travis/PierrickP/n26/master.svg?maxAge=2592000)](https://travis-ci.org/PierrickP/n26) [![Coveralls](https://img.shields.io/coveralls/jekyll/jekyll.svg?maxAge=2592000)](https://coveralls.io/github/PierrickP/n26) [![bitHound](https://img.shields.io/bithound/dependencies/github/PierrickP/n26.svg?maxAge=2592000)](https://www.bithound.io/github/PierrickP/n26) [![Known Vulnerabilities](https://snyk.io/test/npm/name/badge.svg)](https://snyk.io/test/npm/name) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/PierrickP/n26/develop/LICENSE.md) [![Greenkeeper badge](https://badges.greenkeeper.io/PierrickP/n26.svg)](https://greenkeeper.io/)

Un-official node.js module for interact with your n26 (previously number26) account

Open a free [N26 account here :gift:](https://my.number26.de/?uc=MZMEF)

[![NPM](https://nodei.co/npm/n26.png)](https://nodei.co/npm/n26/)

[Api docs](http://pierrickpaul.fr/n26/)

## What's N26 ?

> N26 is Europe's first bank account developed entirely for smartphones. With your N26 bank account, MasterCard® and mobile app, you can conveniently transfer money from anywhere and keep track of your finances at all times. With MoneyBeam you're able to send money via sms or e-mail without the need to enter all the account details.
>
> There are no costs or fees, which means you can withdraw money at any ATM worldwide, free of charge. No ATM around you? Just use CASH26 to withdraw and deposit cash at your supermarket.

[Open a free account here :gift:](https://my.number26.de/?uc=MZMEF)

## This module

n26 has some un-official apis.
This module provide you clean functions to interact with your account.

Not all endpoints are available yet.

### WIP :construction:

+ [x] Auth
+ [x] Get Transactions (with search)
+ [x] Add / update memo on transactions
+ [x] Create a transfert
+ [x] unpair
+ [ ] pair
+ [ ] certify transfer

### Dependencies

n26 depends on:

+ [bluebird](https://www.npmjs.com/package/bluebird): Bluebird is a full featured promise library with unmatched performance.
+ [moment](https://www.npmjs.com/package/moment): A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
+ [request-promise](https://www.npmjs.com/package/request-promise): The world-famous HTTP client 'Request' now Promises/A+ compliant.

### Use :sos:

#### How to install

`npm i n26 --save`

#### Example

```JavaScript
const N26 = require('n26');

const myAccount = new N26('username@mail.com', 'password')
  .then(account => account.transactions({text: 'Lafayette'})
  .then(transactions => {
  /*
    [{
      "id" : "abbc81ce-a5ab-4b5b-a5c2-82541bdb4630",
      "type" : "PT",
      "smartLinkId" : "1125318169-598442",
      "amount" : -21.79,
      "currencyCode" : "EUR",
      "originalAmount" : -21.79,
      "originalCurrency" : "EUR",
      "exchangeRate" : 1.0,
      "merchantCity" : "PARIS",
      "visibleTS" : 1455292872000,
      "mcc" : 5977,
      "mccGroup" : 4,
      "merchantName" : "LAFAYETTE INT.",
      "merchantId" : "970003006643142",
      "recurring" : false,
      "userId" : "8a21b871-0585-481b-ab62-8e3e2d380757",
      "linkId" : "1125318169-598442",
      "accountId" : "5430d368-a0d3-45b3-bcf7-607ece248fa5",
      "category" : "micro-leisure",
      "cardId" : "24f7804b-8a95-4e80-b48a-11fe395ed505",
      "pending" : false,
      "transactionNature" : "NORMAL",
      "confirmed" : 1455494400000
    }]
   */
  });
```

#### API

[Api docs](http://pierrickpaul.fr/n26/)

### Testing

#### Mocked

> do it, it's safe !

Run `npm test` for full mocked testing with coverage.

#### :warning: Unmocked :warning:

Less asserts. Used to detect api change.

Run `npm run test-unmock` for un-mocked test.
