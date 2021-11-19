import { expect } from "chai";
import { artifacts, web3 } from "hardhat";
import { Greeter } from "../typechain/Greeter";

describe("Greeter", function () {
  it("should deploy contract correctly", async () => {
    const contractArtifact = await artifacts.readArtifact("Greeter");

    const contract = new web3.eth.Contract(contractArtifact.abi);

    const accounts = await web3.eth.getAccounts();

    const receipt = await contract
      .deploy({ data: contractArtifact.bytecode, arguments: ["Hello there"] })
      .send({ from: process.env.DEPLOYER_ACCOUNT || accounts[0] });

    const deploymentAddress = receipt.options.address;

    const deployedContract = new web3.eth.Contract(
      contractArtifact.abi,
      deploymentAddress
    ) as unknown as Greeter;

    expect(await deployedContract.methods.greet().call()).to.equal(
      "Hello there"
    );
  });

  it("Should update greeting once it has changed", async function () {
    const contractArtifact = await artifacts.readArtifact("Greeter");

    const contract = new web3.eth.Contract(contractArtifact.abi);

    const accounts = await web3.eth.getAccounts();

    const receipt = await contract
      .deploy({ data: contractArtifact.bytecode, arguments: ["Hello there"] })
      .send({ from: process.env.DEPLOYER_ACCOUNT || accounts[0] });

    const deploymentAddress = receipt.options.address;

    const deployedContract = new web3.eth.Contract(
      contractArtifact.abi,
      deploymentAddress
    ) as unknown as Greeter;

    await deployedContract.methods
      .setGreeting("Hello again")
      .send({ from: process.env.DEPLOYER_ACCOUNT || accounts[0] });

    expect(await deployedContract.methods.greet().call()).to.equal(
      "Hello again"
    );
  });
});
