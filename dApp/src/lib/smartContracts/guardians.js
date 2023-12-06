import { ethers } from "ethers";
import { guardiansABI } from "../../../smartContracts/guardians";

export async function mintBatch(address, deployment) {
  try {
    const contractAddress = deployment.guardians;
    const contractABI = guardiansABI;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const randomNumber = () => {
      return Math.floor(Math.random() * 199) + 1;
    };
    // Create array with 3 random numbers
    const randomNumbers = [randomNumber(), randomNumber(), randomNumber()];

    const tx = await contract.mintBatch(address, randomNumbers, [1, 1, 1]);

    // Wait for the transaction to be mined
    const response = await tx.wait();
  } catch (error) {
    // Handle error
    console.error("Error:", error);
  }
}
