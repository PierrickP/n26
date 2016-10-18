'use strict';
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const N26 = require('../../index');

const expect = chai.expect;

chai.use(dirtyChai);

const meProperties = [
  'userInfo.id',
  'userInfo.email',
  'userInfo.firstName',
  'userInfo.lastName',
  'userInfo.kycFirstName',
  'userInfo.kycLastName',
  'userInfo.title',
  'userInfo.gender',
  'userInfo.birthDate',
  'userInfo.signupCompleted',
  'userInfo.nationality',
  'userInfo.birthPlace',
  'userInfo.mobilePhoneNumber',
  'userInfo.shadowID',
  'account.status',
  'account.availableBalance',
  'account.usableBalance',
  'account.bankBalance',
  'account.iban',
  'account.id',
  'cards[0].maskedPan',
  'cards[0].expirationDate',
  'cards[0].cardType',
  'cards[0].exceetExpressCardDelivery',
  'cards[0].n26Status',
  'cards[0].pinDefined',
  'cards[0].cardActivated',
  'cards[0].id',
  'addresses[0].addressLine1',
  'addresses[0].streetName',
  'addresses[0].houseNumberBlock',
  'addresses[0].zipCode',
  'addresses[0].cityName',
  'addresses[0].countryName',
  'addresses[0].type',
  'addresses[0].id',
  'userFeatures',
  'userStatus.singleStepSignup',
  'userStatus.emailValidationInitiated',
  'userStatus.emailValidationCompleted',
  'userStatus.phonePairingInitiated',
  'userStatus.phonePairingCompleted',
  'userStatus.kycInitiated',
  'userStatus.kycCompleted',
  'userStatus.kycWebIDInitiated',
  'userStatus.kycWebIDCompleted',
  'userStatus.cardActivationCompleted',
  'userStatus.cardIssued',
  'userStatus.pinDefinitionCompleted',
  'userStatus.bankAccountCreationInitiated',
  'userStatus.bankAccountCreationSucceded',
  'userStatus.firstIncomingTransaction',
  'userStatus.smsVerificationCode',
  'userStatus.unpairTokenCreation',
  'userStatus.finoIntegrationStatus',
  'userStatus.id',
  'preference.locale',
  'preference.AAPushNotificationActive',
  'preference.AFPushNotificationActive',
  'preference.AVPushNotificationActive',
  'preference.ARPushNotificationActive',
  'preference.DTPushNotificationActive',
  'preference.CTPushNotificationActive',
  'preference.DDPushNotificationActive',
  'preference.DRPushNotificationActive',
  'preference.AAEmailNotificationActive',
  'preference.AFEmailNotificationActive',
  'preference.AVEmailNotificationActive',
  'preference.AREmailNotificationActive',
  'preference.DTEmailNotificationActive',
  'preference.CTEmailNotificationActive',
  'preference.DDEmailNotificationActive',
  'preference.DREmailNotificationActive',
  'preference.id',
  'userCustomSetting.RATING_DIALOG_SEEN',
  'userCustomSetting.TRANSFERWISE_DIALOG_SEEN',
  'userCustomSetting.OVERDRAFT_NOTIFY_UPGRADE',
  'userCustomSetting.user'
];
const statusesProperties = [
  'singleStepSignup',
  'emailValidationInitiated',
  'emailValidationCompleted',
  'phonePairingInitiated',
  'phonePairingCompleted',
  'kycInitiated',
  'kycCompleted',
  'kycWebIDInitiated',
  'kycWebIDCompleted',
  'cardActivationCompleted',
  'cardIssued',
  'pinDefinitionCompleted',
  'bankAccountCreationInitiated',
  'bankAccountCreationSucceded',
  'firstIncomingTransaction',
  'smsVerificationCode',
  'unpairTokenCreation',
  'finoIntegrationStatus',
  'id'
];
const contactsProperties = [
  'id',
  'name',
  'subtitle',
  'account.accountType',
  'account.iban',
  'account.bic'
];
const categoriesProperties = [
  'id',
  'base64Image',
  'name'
];

describe('Create instance', function () { // eslint-disable-line func-names
  this.timeout(60000);

  it('should create instance', () => {
    return new N26(global.CONFIG.email, global.CONFIG.password)
      .then(m => {
        expect(m).to.be.exist();
        global.n26 = m;
      });
  });

  it('should get profil', () => {
    return global.n26.me(true)
      .then(profil => {
        meProperties.forEach(property => {
          expect(profil).to.have.deep.property(property);
        });

        console.log(`\tMe: ${profil.userInfo.firstName} ${profil.userInfo.lastName}`);
      });
  });

  it('should get account', () => {
    return global.n26.account()
      .then(account => {
        expect(account).to.have.property('availableBalance');
        expect(account).to.have.property('bankBalance');
        expect(account).to.have.property('iban');
        expect(account).to.have.property('id');
        expect(account).to.have.property('status');
        expect(account).to.have.property('usableBalance');


        console.log(`\tAccount: ${account.status} ${account.iban}`);
      });
  });

  it('should get addresses', () => {
    return global.n26.addresses()
      .then(addresses => {
        expect(addresses).to.be.an('object');
        expect(addresses).to.have.deep.property('paging.totalResults');
        expect(addresses).to.have.property('data').that.is.an('array');

        console.log(`\t${addresses.paging.totalResults} addresses`);

        addresses.data.forEach(a => {
          expect(a).to.have.property('addressLine1');
          expect(a).to.have.property('streetName');
          expect(a).to.have.property('houseNumberBlock');
          expect(a).to.have.property('zipCode');
          expect(a).to.have.property('cityName');
          expect(a).to.have.property('countryName');
          expect(a).to.have.property('type');
          expect(a).to.have.property('id');

          console.log(`\t- ${a.type} ${a.addressLine1} ${a.streetName}`);
        });
      });
  });

  it('should return statuses', () => {
    return global.n26.statuses().then(statuses => {
      statusesProperties.forEach(property => {
        expect(statuses).to.have.deep.property(property);
      });

      console.log(`\tYour card was actived: ${new Date(statuses.cardActivationCompleted)}`);
    });
  });

  it('should get account limits', () => {
    return global.n26.limits().then(limits => {
      console.log(`\tYour account is limited to ${limits[0].amount} for ${limits[0].limit}`);
    });
  });

  it('should set account limits', () => {
    let previousAtmDailyAccount;

    return global.n26.limits().then(limits => {
      limits.forEach(limit => {
        if (limit.limit === 'ATM_DAILY_ACCOUNT') {
          previousAtmDailyAccount = limit.amount;
        }
      });
    })
    .then(() => global.n26.limits({atm: 500}))
    .then(() => global.n26.limits())
    .then(limits => {
      limits.forEach(limit => {
        if (limit.limit === 'ATM_DAILY_ACCOUNT') {
          expect(limit.amount).to.be.eql(500);
        }
      });

      return global.n26.limits({atm: previousAtmDailyAccount});
    });
  });

  it('should get contacts', () => {
    return global.n26.contacts().then(contacts => {
      contacts.forEach(contact => {
        contactsProperties.forEach(property => {
          expect(contact).to.have.deep.property(property);
        });
      });

      console.log(`\tFirst contacts: ${contacts[0].name} ${contacts[0].subtitle}`);
    });
  });

  it('should get csv', () => {
    const fromDate = new Date().getTime() - 2629746000;
    return global.n26.csv(fromDate).then(csv => {
      const transactions = csv.split('\n');
      console.log(`\tCSV: ${transactions.length - 2} transactions on the csv`);
    });
  });

  it('should get categories', () => {
    return global.n26.categories().then(categories => {
      categories.forEach(category => {
        categoriesProperties.forEach(property => {
          expect(category).to.have.deep.property(property);
        });
      });

      console.log(`\tCategories: ${categories.length} transaction categories`);
    });
  });

  require('./cards.js');
  require('./barzahlen.js');
  require('./transactions.js');
  require('./statements.js');
  require('./invitations.js');
  require('./stats.js');
  require('./transfer.js');
  require('./unpair.js');
});
