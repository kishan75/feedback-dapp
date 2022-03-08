import TransactorJSON from "../contracts/Transactor.json";
import BHUToken from "../contracts/BHUToken.json";
import Web3 from "web3";

export let web3;
var contract = require("@truffle/contract");

export const load = async () => {
  web3 = await loadWeb3();
  const accountAddress = await loadAccount();
  const { transactorContract, bhuTokenContract, accountBalance } =
    await loadContract(accountAddress);

  return {
    accountAddress,
    transactorContract,
    bhuTokenContract,
    accountBalance,
  };
};

const loadContract = async (addressAccount) => {
  let theContract = contract(TransactorJSON);
  theContract.setProvider(web3.eth.currentProvider);
  const transactorContract = await theContract.deployed();
  theContract = contract(BHUToken);
  theContract.setProvider(web3.eth.currentProvider);
  const bhuTokenContract = await theContract.deployed();
  const accountBalance = await transactorContract.checkBalance(addressAccount);
  return { transactorContract, bhuTokenContract, accountBalance };
};

const loadAccount = async () => {
  const addressAccount = await web3.eth.getCoinbase();
  return addressAccount;
};

const loadWeb3 = async () => {
  // Modern dapp browsers...
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      return web3;
    } catch (error) {
      console.error(error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use Mist/MetaMask's provider.
    const web3 = window.web3;
    console.log("Injected web3 detected.");
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545");
    const web3 = new Web3(provider);
    console.log("No web3 instance injected, using Local web3.");
    return web3;
  }
};
