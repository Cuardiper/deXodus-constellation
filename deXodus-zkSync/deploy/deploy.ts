import { deployContract } from "./utils";
import * as hre from "hardhat";
import { getWallet } from "./utils";
import { ethers } from "ethers";

export default async function () {

  // #################################### Contract DEPLOYMENTS #############################################
  let contractArtifactName = "Futures";
  // const constructorArguments = [];
  // const FuturesContract = await deployTheContractAsProxy(contractArtifactName, constructorArguments);
  // contractArtifactName = "LiquidityPool";
  // const LiquidityPoolContract = await deployTheContractAsProxy(contractArtifactName, constructorArguments);
  // contractArtifactName = "EXD";
  // const EXDContract = await deployTheContractAsProxy(contractArtifactName, constructorArguments);
  // contractArtifactName = "PriceFeed";
  // const PriceFeedContract = await deployTheContractAsProxy(contractArtifactName, constructorArguments);
  // contractArtifactName = "MockUSDC";
  // const MockTokenContract = await deployTheContractAsProxy(contractArtifactName, constructorArguments);

  // let exp;
  // let experiences: number[] = [];
  // for (let i = 0; i < 100; i++) {
  //   exp = 500 * (i + 2) ** 2 - 500 * (i + 2);
  //   experiences.push(exp);
  // }
  // contractArtifactName = "Guardians";
  // const constructorArgumentsforGuardians = ["Guardians", "GRD", "https://ipfs.io/ipfs/bafybeie4rqfkmtugo76im235g2qvur2vmj5mszsbfi3t6yddbmvj5d6chi/", [6,15,27,42,62,89], experiences];
  // await deployTheContract(contractArtifactName, constructorArgumentsforGuardians);
  contractArtifactName = "ChestZKSync";
  const constructorArgumentsforChest = [50 * 1e6, 3, "0xc7Cfb58925C4454010D20aBC40AB19a3B6EdB59d", "0xd8b8E8530a3DAA309886fcCF80761Fe81e2dF4d0", "0xe3CB645a3b550dbAB7C3f6fb92600DcC56F64581", "https://ipfs.io/ipfs/bafybeif4puipnguxms5hkhjemoqq55ukzblj2bfbea5gtxprp7hlhbn3vu/"];
  await deployTheContract(contractArtifactName, constructorArgumentsforChest);


  // contractArtifactName = "deXodusPaymaster";
  // const constructorArgumentsfordeXodusPaymaster = [];
  // await deployTheContract(contractArtifactName, constructorArgumentsfordeXodusPaymaster);


  // #################################### Contract INITS #############################################
  // const FuturesContractArtifact = await hre.artifacts.readArtifact("Futures");
  // const FuturesContractToInit = new ethers.Contract(FuturesContract, FuturesContractArtifact.abi, getWallet());
  // const FuturesInit = await FuturesContractToInit.initialize(LiquidityPoolContract, PriceFeedContract, MockTokenContract, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", 1005);
  // console.log(`Transaction hash of FuturesInit: ${FuturesInit.hash}`);
  // await FuturesInit.wait();

  // const FuturescreateFuture1 = await FuturesContractToInit.createFuture("WBTC:USDC");
  // console.log(`Transaction hash of FuturescreateFuture1: ${FuturescreateFuture1.hash}`);
  // await FuturescreateFuture1.wait();

  // const FuturescreateFuture2 = await FuturesContractToInit.createFuture("WETH:USDC");
  // console.log(`Transaction hash of FuturescreateFuture2: ${FuturescreateFuture2.hash}`);
  // await FuturescreateFuture2.wait();

  // const LiquidityPoolContractArtifact = await hre.artifacts.readArtifact("LiquidityPool");
  // const LiquidityPoolContractToInit = new ethers.Contract(LiquidityPoolContract, LiquidityPoolContractArtifact.abi, getWallet());
  // const LiquidityPoolInit = await LiquidityPoolContractToInit.initialize(MockTokenContract, "deXodus LP", "EXDLP", FuturesContract);
  // console.log(`Transaction hash of LiquidityPoolInit: ${LiquidityPoolInit.hash}`);
  // await LiquidityPoolInit.wait();

  // const EXDContractArtifact = await hre.artifacts.readArtifact("EXD");
  // const EXDContractToInit = new ethers.Contract(EXDContract, EXDContractArtifact.abi, getWallet());
  // const EXDInit = await EXDContractToInit.initialize("deXodus Exchange", "EXD");
  // console.log(`Transaction hash of EXDInit: ${EXDInit.hash}`);
  // await EXDInit.wait();

  // const PriceFeedContractArtifact = await hre.artifacts.readArtifact("PriceFeed");
  // const PriceFeedContractToInit = new ethers.Contract(PriceFeedContract, PriceFeedContractArtifact.abi, getWallet());
  // const PriceFeedInit = await PriceFeedContractToInit.initialize(MockTokenContract, ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"], ["0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"], "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2");
  // console.log(`Transaction hash of PriceFeedInit: ${PriceFeedInit.hash}`);
  // await PriceFeedInit.wait();

  // const MockTokenContractArtifact = await hre.artifacts.readArtifact("MockUSDC");
  // const MockTokenContractToInit = new ethers.Contract(MockTokenContract, MockTokenContractArtifact.abi, getWallet());
  // const MockTokenInit = await MockTokenContractToInit.initialize("USDC Mock", "mUSDC");
  // console.log(`Transaction hash of MockTokenInit: ${MockTokenInit.hash}`);
  // await MockTokenInit.wait();

  // const MockTokenFirstMint = await MockTokenContractToInit.mint("0xf8ba73E81ed9E6A5b47EE736726fd0fD21c99D75", 1000000 * 1e6);
  // console.log(`Transaction hash of MockTokenFirstMint: ${MockTokenFirstMint.hash}`);
  // await MockTokenFirstMint.wait();

}

export const deployTheContractAsProxy = async (contractArtifactName: string, constructorArguments?: any[]) => {
  const contract = await deployContract(contractArtifactName, constructorArguments);
  const contractArtifactName1 = "ERC1967Proxy";
  const emptyBytes: Uint8Array = new Uint8Array(0);
  const constructorArguments1 = [contract.address, emptyBytes];
  const contract1 = await deployContract(contractArtifactName1, constructorArguments1);
  console.log(contractArtifactName + " ------------>", contract1.address);
  return contract1.address;
}

export const deployTheContract = async (contractArtifactName: string, constructorArguments?: any[]) => {
  const contract = await deployContract(contractArtifactName, constructorArguments);
  console.log(contractArtifactName + " ------------>", contract.address);
}