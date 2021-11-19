// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { artifacts, web3 } from "hardhat";

async function main() {
  const contractArtifact = await artifacts.readArtifact("Greeter");

  const contract = new web3.eth.Contract(contractArtifact.abi);

  const accounts = await web3.eth.getAccounts();

  const receipt = await contract
    .deploy({ data: contractArtifact.bytecode, arguments: ["Hello there"] })
    .send({ from: process.env.DEPLOYER_ACCOUNT || accounts[0] });

  console.log("Deployed at address:", receipt.options.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
