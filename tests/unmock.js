'use strict';
/* eslint-disable global-require, max-len, no-console, arrow-body-style */

const Mocha = require('mocha');
const inquirer = require('inquirer');
const Configstore = require('configstore');

const mocha = new Mocha({bail: true});
const config = new Configstore('number26-unmock', {options: {}});

function hasOptions(opts) {
  return (answers) => {
    opts = Array.isArray(opts) ? opts : [opts];

    return !!opts.find(o => answers.options.indexOf(o) !== -1);
  };
}

const questions = [{
  type: 'input',
  name: 'email',
  message: 'Account email:',
  default: process.env.N26_EMAIL || config.get('email')
}, {
  type: 'password',
  name: 'password',
  message: 'Password account:',
  default: process.env.N26_PASSWORD
}, {
  type: 'checkbox',
  message: 'Select options',
  name: 'options',
  choices: [{
    name: 'Statement',
    checked: config.get('options.statement') ? config.get('options.statement') : true
  }, {
    name: 'Invitation',
    default: process.env.N26_OPTIONS_INVITE || config.get('options.invite')
  }, {
    name: 'Transfer',
    default: process.env.N26_OPTIONS_TRANSFER || config.get('options.transfer')
  }, {
    name: 'Unpair',
    default: process.env.N26_OPTIONS_UNPAIR || config.get('options.unpair')
  }]
}, {
  type: 'password',
  name: 'pin',
  message: 'Pin number:',
  default: process.env.N26_PIN,
  validate: pin => pin.length === 4,
  when: hasOptions(['Transfer', 'Unpair'])
}, {
  type: 'input',
  name: 'inviteEmail',
  message: 'Send invitation to email:',
  when: hasOptions('Invitation')
}, {
  type: 'input',
  name: 'transferIBAN',
  message: 'IBAN transfer:',
  default: process.env.N26_OPTIONS_TRANSFER_IBAN || config.get('transfer.iban'),
  validate: iban => /[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}/.test(iban),
  when: hasOptions('Transfer')
}, {
  type: 'input',
  name: 'transferBIC',
  message: 'BIC transfer:',
  default: process.env.N26_OPTIONS_TRANSFER_BIC || config.get('transfer.bic'),
  validate: bic => /([a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?)/.test(bic),
  when: hasOptions('Transfer')
}, {
  type: 'input',
  name: 'transferNAME',
  message: 'NAME transfer:',
  default: process.env.N26_OPTIONS_TRANSFER_NAME || config.get('transfer.name'),
  when: hasOptions('Transfer')
}, {
  type: 'input',
  name: 'cardNumber',
  message: '10 digits on card:',
  default: process.env.N26_OPTIONS_UNPAIR_CARDNUMBER || config.get('unpair.cardNumber'),
  validate: cardNumber => cardNumber.length === 10,
  when: hasOptions('Unpair')
}];

inquirer.prompt(questions).then((answers) => {
  global.CONFIG = answers;

  config.set('email', answers.email);
  config.set('options', {});

  answers.options.forEach((opt) => {
    if (opt === 'Invitation') {
      config.set('options.invite', true);
    }

    if (opt === 'Transfer') {
      config.set('options.transfer', true);
      config.set('transfer', {
        iban: answers.transferIBAN,
        bic: answers.transferBIC,
        name: answers.transferNAME
      });
    }

    if (opt === 'Unpair') {
      config.set('options.unpair', true);
      config.set('unpair.cardNumber', answers.cardNumber);
    }
  });

  mocha.addFile(`${__dirname}/unmock/index.js`);
  mocha.run((failures) => {
    process.exit(failures);
  });
});
