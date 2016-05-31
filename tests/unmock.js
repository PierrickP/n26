'use strict';
/* eslint-disable global-require, max-len, no-console, arrow-body-style */
const readline = require('readline');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const expect = chai.expect;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const Number26 = require('../index');

chai.use(dirtyChai);

const transactionsLimit = process.env.TRANSACTIONS_LIMIT || 2;
const commonTransactionFields = ['id', 'userId', 'type', 'amount', 'smartLinkId', 'linkId', 'accountId', 'category', 'cardId', 'pending', 'transactionNature', 'visibleTS', 'recurring'];
const transactionFields = {
  PT: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId']),
  DT: commonTransactionFields.concat(['partnerAccountIsSepa', 'partnerName', 'partnerIban', 'referenceText', 'userCertified', 'smartContactId']),
  CT: commonTransactionFields.concat(['currencyCode', 'partnerBic', 'partnerAccountIsSepa', 'partnerName', 'partnerIban', 'referenceText', 'smartContactId', 'confirmed']),
  AE: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId']),
  AA: commonTransactionFields.concat(['currencyCode', 'originalAmount', 'originalCurrency', 'exchangeRate', 'merchantCity', 'mcc', 'mccGroup', 'merchantName', 'merchantId', 'transactionTerminal'])
};
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
const transactionProperties = [
  'id',
  'userId',
  'type',
  'amount',
  'smartLinkId',
  'currencyCode',
  'originalAmount',
  'originalCurrency',
  'exchangeRate',
  'merchantCity',
  'visibleTS',
  'mcc',
  'mccGroup',
  'merchantName',
  'merchantId',
  'recurring',
  'linkId',
  'accountId',
  'category',
  'cardId',
  'pending',
  'transactionNature',
  'tags'
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
const barzahlenProperties = [
  'depositAllowance',
  'withdrawAllowance',
  'remainingAmountMonth',
  'feeRate',
  'cash26WithdrawalsCount',
  'cash26WithdrawalsSum',
  'atmWithdrawalsCount',
  'atmWithdrawalsSum',
  'monthlyDepositFeeThreshold',
  'success'
];
const barzahlenBranchesProperties = [
  'id',
  'lat',
  'lng',
  'title',
  'street_no',
  'zipcode',
  'city',
  'countrycode',
  'opening_hours',
  'logo_url',
  'logo_thumbnail_url',
  'minutes_until_close',
  'offline_partner_id'
];

describe('Create instance', function () {
  this.timeout(5000);
  let n26;

  it('should create instance', () => {
    return new Number26(process.env.TEST_EMAIL, process.env.TEST_PASSWORD)
      .then((m) => {
        expect(m).to.be.exist();
        n26 = m;
      });
  });

  it('should get profil', () => {
    return n26.me(true)
      .then((profil) => {
        meProperties.forEach(property => {
          expect(profil).to.have.deep.property(property);
        });

        console.log(`\tMe: ${profil.userInfo.firstName} ${profil.userInfo.lastName}`);
      });
  });

  it('should get account', () => {
    return n26.account()
      .then((account) => {
        expect(account).to.have.property('availableBalance');
        expect(account).to.have.property('bankBalance');
        expect(account).to.have.property('iban');
        expect(account).to.have.property('id');
        expect(account).to.have.property('status');
        expect(account).to.have.property('usableBalance');


        console.log(`\tAccount: ${account.status} ${account.iban}`);
      });
  });

  it('should check barzahlen', () => {
    return n26.barzahlen()
      .then((barzahlen) => {

        barzahlenProperties.forEach(property => {
          expect(barzahlen).to.have.deep.property(property);
        });

        console.log(`\tBarzahlen: ${barzahlen.depositAllowance} € deposit allowed`);
      });
  });

  it('should get barzahlen', () => {
    return Number26.barzahlen({
      nelat: 52.6078,
      nelon: 13.5338,
      swlat: 52.4165,
      swlon: 13.2688
    })
    .then((barzahlenBranches) => {
      barzahlenBranches.forEach((branch) => {
        barzahlenBranchesProperties.forEach(property => {
          expect(branch).to.have.deep.property(property);
        });
      });

      console.log(`\tBarzahlen: ${barzahlenBranches.length} places in this zone`);
    });
  });

  it('should get cards', () => {
    return n26.cards()
      .then((cards) => {
        expect(cards).to.be.an('object');
        expect(cards).to.have.deep.property('paging.totalResults');
        expect(cards).to.have.property('data').that.is.an('array');

        console.log(`\t${cards.paging.totalResults} cards`);

        cards.data.forEach(c => {
          expect(c).to.have.property('maskedPan');
          expect(c).to.have.property('expirationDate');
          expect(c).to.have.property('cardType');
          expect(c).to.have.property('n26Status');
          expect(c).to.have.property('pinDefined');
          expect(c).to.have.property('cardActivated');
          expect(c).to.have.property('usernameOnCard');
          expect(c).to.have.property('id');

          console.log(`\t- ${c.cardType} ${c.n26Status} ${c.maskedPan}`);
        });
      });
  });

  it('should get addresses', () => {
    return n26.addresses()
      .then((addresses) => {
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

  it('should get recipients', () => {
    return n26.recipients()
      .then((recipients) => {
        expect(recipients).to.be.an('array');

        console.log(`\t${recipients.length} recipients`);

        recipients.forEach(r => {
          expect(r).to.have.property('iban');
          expect(r).to.have.property('name');
          expect(r).to.have.property('bic');

          console.log(`\t- ${r.name} ${r.iban} ${r.bic}`);
        });
      });
  });

  it(`should get transactions - limit ${transactionsLimit}`, () => {
    return n26.transactions({limit: transactionsLimit})
      .then((transactions) => {
        expect(transactions).to.be.an('array');

        console.log(`\tLast ${transactions.length} transactions`);

        transactions.forEach(t => {
          expect(t).to.have.property('type');

          if (!transactionFields[t.type]) {
            console.log(t);
          }

          transactionFields[t.type].forEach(f => {
            expect(t).to.have.property(f);
          });

          console.log(`\t- ${t.type} ${t.amount} ${t.merchantName || t.partnerName}`);
        });
      });
  });

  it('should get transaction detail', () => {
    return n26.transactions()
      .then((transactions) => {
        return n26.transaction(transactions[0].id).then(detail => {
          transactionProperties.forEach(property => {
            expect(detail).to.have.deep.property(property);
          });
        });
      });
  });

  it('should update memo on transaction', () => {
    return n26.transactions()
      .then((transactions) => {
        return n26.transaction(transactions[0].id, {meta: true}).then(d => {
          const previousMemo = d.meta.memo;
          const newMemo = `YOLO${Math.round(Math.random() * 1000)}`;

          return n26.memo(transactions[0].smartLinkId, newMemo)
            .then(() => {
              return n26.transaction(transactions[0].id, {meta: true}).then(dd => {
                expect(dd.meta.memo).to.be.eql(newMemo);

                return n26.memo(transactions[0].smartLinkId, previousMemo);
              });
            });
        });
      });
  });

  it('should return email invited', () => {
    return n26.invitations().then((emails) => {
      expect(emails).to.be.an('array');
      emails.forEach((e) => {
        ['invited', 'status', 'reward', 'created'].forEach((p) => {
          expect(e).to.have.property(p);
        });
      });

      console.log(`\t${emails[0].invited} was invited`);
    });
  });

  it('should return statuses', () => {
    return n26.statuses().then((statuses) => {

      statusesProperties.forEach(property => {
        expect(statuses).to.have.deep.property(property);
      });

      console.log(`\tYour card was actived: ${new Date(statuses.cardActivationCompleted)}`);
    });
  });

  if (!process.env.INVITE ||!process.env.EMAIL) {
    xit('shoud send invitation');
  } else {
    it('should send invitation', () => {
      return n26.invitations(process.env.EMAIL).then(() => {
        console.log(`\tInvitation sent`);
      });
    });
  }

  if (process.env.NO_TRANSFER || !process.env.TRANSFER_IBAN || !process.env.TRANSFER_BIC || !process.env.TRANSFER_NAME || !process.env.TRANSFER_PIN) {
    xit('should transfer money out');
  } else {
    it('should transfer money out', () => {
      return n26.transfer({
        pin: process.env.TRANSFER_PIN,
        iban: process.env.TRANSFER_IBAN,
        bic: process.env.TRANSFER_BIC,
        amount: 0.01,
        name: process.env.TRANSFER_NAME,
        reference: 'Test'
      })
      .then((t) => {
        expect(t).to.have.property('n26Iban');
        expect(t).to.have.property('referenceText', 'Test');
        expect(t).to.have.property('partnerName');
        expect(t).to.have.property('partnerIban');
        expect(t).to.have.property('partnerBic');
        expect(t).to.have.property('partnerAccountIsSepa');
        expect(t).to.have.property('amount');
        expect(t).to.have.deep.property('currencyCode.currencyCode');
        expect(t).to.have.property('linkId');
        expect(t).to.have.property('recurring', false);
        expect(t).to.have.property('type', 'DT');
        expect(t).to.have.property('visibleTS');
        expect(t).to.have.property('id');

        console.log(`\tTransfer: ${t.partnerName} ${t.amount} ${t.partnerBic}`);
      });
    });
  }

  if (!process.env.UNPAIR || !process.env.CARD_NUMBER) {
    xit('should unpair phone');
  } else {
    it('should unpair phone', function (cb) {
      this.timeout(60000);

      return n26.unpairInit(process.env.TRANSFER_PIN, process.env.CARD_NUMBER)
        .then(() => {
          return rl.question('token received by sms: ', (smsNumber) => {
            rl.close();

            return n26.unpairConfirm(smsNumber)
              .then(() => {
                console.log(`\tDevice unpaired`);
                cb();
              })
              .catch(cb);
          });
        })
        .catch(cb);
    });
  }
});
