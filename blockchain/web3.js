const Web3 = require('web3');
const contractABI = require('./build/contracts/RBAC.json').abi; 
require('dotenv').config();

if (!process.env.BLOCKCHAIN_PROVIDER || !process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("Please set BLOCKCHAIN_PROVIDER and BLOCKCHAIN_CONTRACT_ADDRESS in the .env file");
}

const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
const contract = new web3.eth.Contract(contractABI, process.env.BLOCKCHAIN_CONTRACT_ADDRESS);

web3.eth.net.isListening()
    .then(() => console.log("Connected to blockchain"))
    .catch((error) => console.error("Blockchain connection error:", error));


console.log("Contract Address:", contract.options.address);

contract.methods.getLogsCount().call()
    .then(count => console.log("Total Logs Count:", count))
    .catch(err => console.error("Error calling contract method:", err));

module.exports = { web3, contract };
