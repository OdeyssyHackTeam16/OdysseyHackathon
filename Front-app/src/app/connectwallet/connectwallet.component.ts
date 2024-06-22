import { Component, OnInit, OnDestroy } from '@angular/core';
import { WalletService } from '../service/wallet.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connectwallet',
  templateUrl: './connectwallet.component.html',
  styleUrls: ['./connectwallet.component.css']
})
export class ConnectwalletComponent implements OnInit, OnDestroy {
  title = 'ng-connect-ethereum-wallet';
  public connectingstat: boolean = false;
  public walletConnected: boolean = false;
  public walletId: string = '';
  public showPenguin: boolean = false;
  private checkInterval: Subscription | null = null;

  constructor(private walletService: WalletService, private router: Router) { }

  connectToWallet = () => {
    this.connectingstat = true;
    this.walletService.connectWallet().then(() => {
      console.log('connecting....');
      this.checkWalletConnected(); // Check immediately after attempting to connect
    });
  }

  checkWalletConnected = async () => {
    const accounts = await this.walletService.checkWalletConnected();
    if (accounts.length > 0) {
      this.walletConnected = true;
      this.walletId = accounts[0];
      this.showPenguinAnimation(); // Show penguin animation before navigating
    } else {
      this.walletConnected = false;
      this.walletId = '';
    }
  }

  showPenguinAnimation = () => {
    this.connectingstat = false;
    this.showPenguin = true;
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 1000); // Delay of 1 second before navigating
  }

  ngOnInit() {
    this.checkWalletConnected();
    // Check every 3 seconds
    this.checkInterval = interval(3000).subscribe(() => this.checkWalletConnected());
  }

  ngOnDestroy() {
    if (this.checkInterval) {
      this.checkInterval.unsubscribe();
    }
  }
}
