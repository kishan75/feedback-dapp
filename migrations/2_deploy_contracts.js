const BHUToken = artifacts.require("BHUToken");
// const Transactor = artifacts.require("Transactor");
const FeedbackData = artifacts.require("FeedbackData");

const adminKey = "password";

module.exports = async function (deployer) {
  // Deploy BHU Token
  await deployer.deploy(BHUToken);
  const bhuToken = await BHUToken.deployed();

  // Deploy Transactor
  // await deployer.deploy(Transactor, bhuToken.address);
  // const transactor = await Transactor.deployed();

  // Deploy FeedbackData
  await deployer.deploy(FeedbackData, adminKey, bhuToken.address);
  const feedbackData = await FeedbackData.deployed();

  // Transfer all tokens to FeedbackData (1 Mil)
  await bhuToken.transfer(
    feedbackData.address,
    web3.utils.toWei("1000000", "ether")
  );
};
