// var Adoption = artifacts.require("Adoption");
// var SimpleStorage = artifacts.require("SimpleStorage");
// var CrowdFunding = artifacts.require("CrowdFunding");
var ReferralChain = artifacts.require("ReferralChain");

module.exports = function(deployer) {
  // deployer.deploy(Adoption);
  // deployer.deploy(SimpleStorage);
  // deployer.deploy(CrowdFunding);
  deployer.deploy(ReferralChain);
};