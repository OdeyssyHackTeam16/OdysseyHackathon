import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { IpfsService } from './ipfs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'browser-angular';
  id: string | null = null;
  version: string | null = null;
  status: string | null = null;
  isHandset$: Observable<boolean>;
  isConnectWalletPage: boolean = false;

  @ViewChild('drawer') drawer!: MatSidenav;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private ipfsService: IpfsService
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isConnectWalletPage = event.url === '/connect-wallet';
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.adddata();
    }, 2000); // Corrected timeout duration to 2000 milliseconds
  }

  adddata() {
    this.ipfsService.loadDataFromIpfsToDb('/my-id/appliance_consumption.json');
  }

  closeSidenav() {
    if (this.drawer) {
      this.drawer.close();
    }
  }
}
