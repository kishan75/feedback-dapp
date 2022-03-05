const BHUToken = artifacts.require('BHUToken')
const Transactor = artifacts.require('Transactor')

require('chai')
  .use(require('chai-as-promised'))
  .should()

function tokensToWei(n) {
  return web3.utils.toWei(n, 'ether');
}


contract('Transactor', ([owner, user]) => {
  let bhuToken, transactor

  before(async () => {
    // Load Contracts
    bhuToken = await BHUToken.new()
    transactor = await Transactor.new(bhuToken.address)

    // Transfer all BHU tokens to transactor (1 Mil) 
    await bhuToken.transfer(transactor.address, tokensToWei('1000000'))
  })

  describe('BHU token deployment', async () => {
    it('Has a name', async () => {
      const name = await bhuToken.name()
      assert.equal(name, 'BHU Token')
    })
  })

  describe('Transactor deployment', async () => {
    it('Has a name', async () => {
      const name = await transactor.contractName()
      assert.equal(name, 'Transactor')
    })

    it('Has tokens', async () => {
      let balance = await bhuToken.balanceOf(transactor.address)
      assert.equal(balance.toString(), tokensToWei('1000000'))
    })
  })

  describe('Transactor functions', async () => {
    it('Can set tickets', async () => {
      await transactor.setTickets(["ticket1", "ticket2"], { from: owner })
    })
    
    it('Can redeem tokens', async () => {
      await transactor.redeemTokens("ticket1", { from: user })
    })

    it('Can submit feedback', async () => {
      await bhuToken.approve(transactor.address, tokensToWei('1'), { from: user })
      await transactor.submitFeedback("Very good feedback", { from: user })
    })

    it('Performed checks on balances after above tests', async () => {
      result = await bhuToken.balanceOf(user)
      assert.equal(result.toString(), tokensToWei('4'), 'User balance correct')

      result = await bhuToken.balanceOf(owner)
      assert.equal(result.toString(), tokensToWei('0'), 'Owner balance correct')

      result = await bhuToken.balanceOf(transactor.address)
      assert.equal(result.toString(), tokensToWei('999996'), 'Transactor balance correct')
    })
  })
})