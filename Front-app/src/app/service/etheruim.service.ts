// etheruim.service.ts

import { Injectable } from '@angular/core';
import { JsonRpcProvider, Signer, Contract } from 'ethers'; // Import specific modules from ethers
import EfficiencyTokenArtifact from '../contracts/EfficiencyToken.json';

@Injectable({
  providedIn: 'root'
})
export class EtheruimService {
  private provider: JsonRpcProvider;
  private signer: Signer | undefined; // Change to optional Signer
  private contract: Contract | undefined; // Change to optional Contract
  private contractAddress = '0x845606c98d69DAb8cA6626CAAd4282B3fc7A01e3';

  constructor() {
    this.provider = new JsonRpcProvider('http://127.0.0.1:8545');
    this.initialize().then(()=>console.log("in")); // Call initialize() from constructor
  }

  async initialize() {
    console.log(this.contractAddress)
    const accounts : any = await this.provider.listAccounts();
    this.signer =await this.provider.getSigner(accounts[0]); // Assign the Signer instance

    this.contract = new Contract(this.contractAddress, EfficiencyTokenArtifact.abi, this.signer); // Initialize contract with signer
  }

  async rewardBranch(branch: string) {
    try {
      if (!this.contract || !this.signer) {
        await this.initialize(); // Ensure signer and contract are initialized
      }
      await this.contract!.rewardBranch(branch); // Use optional chaining and force unwrap
    } catch (error) {
      console.error('Error rewarding branch:', error);
    }
  }

  async convertToPoints(tokenAmount: number) {
    try {
      if (!this.contract || !this.signer) {
        await this.initialize(); // Ensure signer and contract are initialized
      }
      await this.contract!.convertToPoints(tokenAmount); // Use optional chaining and force unwrap
    } catch (error) {
      console.error('Error converting token to points:', error);
    }
  }

  async getPointsBalance(address: string) {
    try {
      console.log('Address parameter:', address); // Log the address parameter
      await this.initialize(); // Ensure signer and contract are initialized
      const balance = await this.contract!.getPointsBalance(address); // Use optional chaining and force unwrap
      return balance.toString();
    } catch (error) {
      console.error('Error getting points balance:', error);
      return "0";
    }
  }


  async getMaxSupply() {
    try {
      if (!this.contract || !this.signer) {
        await this.initialize(); // Ensure signer and contract are initialized
      }
      const maxSupply = await this.contract!.getMaxSupply(); // Use optional chaining and force unwrap
      return maxSupply.toString();
    } catch (error) {
      console.error('Error getting max supply:', error);
      return "0";
    }
  }
}
