'use strict';
const chai = require('chai');
const dirtyChai = require('dirty-chai');

const expect = chai.expect;

chai.use(dirtyChai);

describe('Invitation', () => {
  it('should return email invited', () => {
    return global.n26.invitations().then((emails) => {
      expect(emails).to.be.an('array');
      emails.forEach((e) => {
        ['invited', 'status', 'reward', 'created'].forEach((p) => {
          expect(e).to.have.property(p);
        });
      });

      console.log(`\t${emails[0].invited} was invited`);
    });
  });

  if (global.CONFIG.options.indexOf('Invitation') === -1) {
    xit('shoud send invitation');
  } else {
    it('should send invitation', () => {
      return global.n26.invitations(global.CONFIG.inviteEmail).then(() => {
        console.log('\tInvitation sent');
      });
    });
  }
});
