import {Component, OnInit} from '@angular/core';
import { EtheruimService } from '../service/etheruim.service';

@Component({
  selector: 'app-token-integration',
  templateUrl: './token-integration.component.html',
  styleUrls: ['./token-integration.component.css']
})
export class TokenIntegrationComponent implements OnInit{
  branchAddress = '';
  points = '';
  reward = '';
  balance: string = "";
  ngOnInit() {this.handleGetBalance()
  }

  constructor(private ethereumService: EtheruimService) {}

  async handleReward() {
    try {
      await this.ethereumService.rewardBranch(this.branchAddress);
      alert('Branch rewarded successfully');
    } catch (error) {
      console.error('Error rewarding branch:', error);
    }
  }

  async handleConvert() {
    try {
      await this.ethereumService.convertToPoints(1);
      alert('Token converted to points successfully');
    } catch (error) {
      console.error('Error converting token to points:', error);
    }
  }
  async loadBalance() {
    try {
      this.balance = await this.ethereumService.getPointsBalance(this.branchAddress);
      console.log("Points balance retrieved:", this.balance);
    } catch (error) {
      console.error('Error loading points balance:', error);
    }
  }

  handleGetBalance() {
    this.loadBalance();
  }


  async handleGetBalanceaaaaaa() {
    try {
      this.balance = await this.ethereumService.getPointsBalance(this.branchAddress);
      console.log("Points balance retrieved:", this.balance);
    } catch (error) {
      console.error('Error getting points balance:', error);
    }
  }
}
