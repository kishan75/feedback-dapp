import TransactorJSON from '../contracts/Transactor.json';
import BHUTokenJSON from '../contracts/BHUToken.json';
//import ProfessorDataJSON from '../contracts/ProfessorData.json';
import Web3 from 'web3';

export let web3
var contract = require('@truffle/contract');

export const loadAll = async () => {
    web3 = await loadWeb3();
    const accountAddress = await loadAccount();
    const { transactorContract, bhuTokenContract, professorDataContract } = await loadContracts();
    const accountBalance = loadBalance(transactorContract, accountAddress)

    return { accountAddress, transactorContract, bhuTokenContract, professorDataContract, accountBalance };
};

const loadContracts = async () => {
    let theContract = contract(TransactorJSON);
    theContract.setProvider(web3.eth.currentProvider);
    const transactorContract = await theContract.deployed();

    theContract = contract(BHUTokenJSON);
    theContract.setProvider(web3.eth.currentProvider);
    const bhuTokenContract = await theContract.deployed();

    // theContract = contract(ProfessorDataJSON);
    // theContract.setProvider(web3.eth.currentProvider);
    // const professorDataContract = await theContract.deployed();
    const professorDataContract = null

    return { transactorContract, bhuTokenContract, professorDataContract }
};

export const loadAccount = async () => {
    const addressAccount = await web3.eth.getCoinbase();
    return addressAccount;
};

export const loadBalance = async (transactorContract, accountAddress) => {
    const accountBalance = await transactorContract.checkBalance(accountAddress);
    return accountBalance;
}

export const loadProfessorData = async (transactorContract, accountAddress) => {
    const accountBalance = await transactorContract.checkBalance(accountAddress);
    return accountBalance;
}

// export const loadAccountChange = async () => {
//     const web3 = await loadWeb3();
//     const addressAccount = await web3.eth.getCoinbase();
//     const accountBalance = await transactorContract.checkBalance(accountAddress);
//     return {web3, addressAccount, accountBalance};
// }

// Web3 loading needs to be updated
export const loadWeb3 = async () => {
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
        console.log('Injected web3 detected.');
        return web3;
    }
    // Fallback to localhost; use dev console port by default...
    else {
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
        const web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        return web3;
    }
};