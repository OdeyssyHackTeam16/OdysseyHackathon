import {inject, Injectable} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
 private toastr = inject(ToastrService);
  public ethereum;
  constructor() {
    const {ethereum} = <any>window
    this.ethereum = ethereum
  }

  public connectWallet = async () => {
    try{
      if(!this.ethereum) return alert("Please install meta mask");
      return await this.ethereum.request({method: 'eth_requestAccounts'})
    }
    catch(e){
      throw new Error("No thereum object found")
    }
  }

  public checkWalletConnected = async () => {
    try{
      if(!this.ethereum) return this.toastr.error('Please add Meta mask extension to ur browser  ')
      return await this.ethereum.request({method: 'eth_accounts'});
    }
    catch(e){
      this.toastr.error('No thereum object found')
      throw new Error("No ethereum object found");
    }
  }
}
