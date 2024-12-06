const RBAC = artifacts.require("RBAC");

module.exports = function (deployer) {
    deployer.deploy(RBAC, {
        gas: 5000000, // Custom gas limit for deployment
    });
};
