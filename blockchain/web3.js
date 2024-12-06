// Import Web3
const Web3 = require('web3');
const contractABI = require('./build/contracts/RBAC.json').abi; // Path to your contract ABI
require('dotenv').config(); // Load environment variables

// Ensure environment variables are set
if (!process.env.BLOCKCHAIN_PROVIDER || !process.env.BLOCKCHAIN_CONTRACT_ADDRESS) {
    throw new Error("Please set BLOCKCHAIN_PROVIDER and BLOCKCHAIN_CONTRACT_ADDRESS in the .env file");
}

// Use a provider URL to create a Web3 instance
const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);

// Create a contract instance using ABI and contract address
const contract = new web3.eth.Contract(contractABI, process.env.BLOCKCHAIN_CONTRACT_ADDRESS);

web3.eth.net.isListening()
    .then(() => console.log("Connected to blockchain"))
    .catch((error) => console.error("Blockchain connection error:", error));


// Check if the contract is connected
console.log("Contract Address:", contract.options.address);

// Test a contract method (e.g., total logs count)
contract.methods.getLogsCount().call()
    .then(count => console.log("Total Logs Count:", count))
    .catch(err => console.error("Error calling contract method:", err));

// Export the web3 and contract instances
module.exports = { web3, contract };
