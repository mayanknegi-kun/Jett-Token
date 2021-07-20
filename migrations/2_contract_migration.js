const JettToken = artifacts.require("JettToken");

module.exports = function (deployer) {
  deployer.deploy(JettToken,10000);
};
