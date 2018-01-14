App = {
  web3Provider: null,
  contracts: {},
  account: null,
  allAccounts: [],

  init: function() {

    const httpProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    httpProvider.eth.getAccounts(function(error, accounts) {
      App.allAccounts = accounts;
      return App.initWeb3();
    });
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(function(error, accounts) {
      account = accounts[0];
      App.allAccounts = App.allAccounts.filter((a) => a != account);
      return App.initContract();
    });
  },

  initContract: function() {
    $.getJSON('ReferralChain.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var ReferralChainArtifact = data;
      App.contracts.ReferralChain = TruffleContract(ReferralChainArtifact);
      App.contracts.ReferralChain.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted referrals
      return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-add', App.handleAdd);
    $(document).on('click', '.btn-award', App.handleAward);
  },

  markAdopted: function(adopters, account) {

    var adoptionInstance;

    App.contracts.ReferralChain.deployed().then(function(instance) {
      adoptionInstance = instance;

      // return adoptionInstance.addReferrer(addr, 33, addEventListener.slice(0,10));
    }).then(function(adopters) {

      var referralsRow = $('#referralsRow');
      var referralTemplate = $('#referralTemplate');

      for (i = 0; i < App.allAccounts.length; i ++) {
        referralTemplate.find('.panel-title').text(App.allAccounts[i].slice(0,10));
        referralTemplate.find('.btn-add').attr('data-id', `${App.allAccounts[i]}`);
        referralTemplate.find('.btn-award').attr('data-id', `${App.allAccounts[i]}`);
        referralsRow.append(referralTemplate.html());

      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdd: function(event) {
    event.preventDefault();

    const account = $(event.target).attr('data-id');

    console.log(100);
    App.contracts.ReferralChain.deployed().then((instance) => {
      console.log(200);
      instance.addReferrer(account, 33, account.slice(0,10));
      console.log(300);
    }).then(function(result) {
      console.log(result);
      $(`button[data-id=${account}]`).find('.btn-add').text('ADDED').attr('disabled', true);
      $(`button[data-id=${account}]`).find('.btn-award').attr('disabled', false);
    }).catch(function(err) {
      console.log('blah');
      console.log(err.message);
    });
  }
};

$(() => $(window).load(() => App.init()));