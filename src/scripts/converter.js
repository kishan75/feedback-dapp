import { web3 } from './loader'

export const tokensToWei = (n) => {
    return web3.utils.toWei(n, 'ether');
}

export const tokensFromWei = (n) => {
    return web3.utils.fromWei(n, 'ether');
}