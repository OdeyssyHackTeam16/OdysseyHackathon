import EfficiencyTokenArtifact from './contracts/EfficiencyToken.json';
import { ethers } from 'ethers';

let provider;
let signer;
let contractWithSigner;

async function initialize() {
  provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const accounts = await provider.listAccounts();
  signer = provider.getSigner(accounts[0]);
  console.log("Provider and signer initialized:", provider, signer);
}

const contractAddress = '0x845606c98d69DAb8cA6626CAAd4282B3fc7A01e3';

async function getContractWithSigner() {
  if (!signer) {
    await initialize();
  }
  const EfficiencyToken = new ethers.Contract(contractAddress, EfficiencyTokenArtifact.abi, signer);
  console.log("Contract with signer:", EfficiencyToken);
  return EfficiencyToken;
}

export async function rewardBranch(branch) {
  try {
    const contractWithSigner = await getContractWithSigner();
    console.log("Rewarding branch:", branch);
    await contractWithSigner.rewardBranch(branch);
    console.log("Congrats! The owner of this address:", branch, "gets the token this week");
  } catch (error) {
    console.error('Error rewarding branch:', error);
  }
}

export async function convertToPoints(tokenAmount) {
  try {
    const contractWithSigner = await getContractWithSigner();
    console.log("Converting to points:", tokenAmount);
    await contractWithSigner.convertToPoints(tokenAmount);
    console.log(tokenAmount, "of your tokens are converted to points now");
  } catch (error) {
    console.error('Error converting to points:', error);
  }
}

export async function redeemPoints(points, reward) {
  try {
    const contractWithSigner = await getContractWithSigner();
    console.log("Redeeming points:", points, "Reward:", reward);
    await contractWithSigner.redeemPoints(points, reward);
  } catch (error) {
    console.error('Error redeeming points:', error);
  }
}

export async function getPointsBalance(address) {
  try {
    const contractWithSigner = await getContractWithSigner();
    console.log("Getting points balance for address:", address);
    const balance = await contractWithSigner.getPointsBalance[address]; 
    console.log('Points Balance:', balance);
    return String(balance);
  } catch (error) {
    console.error('Error getting points balance:', error);
    return "0";
  }
}
