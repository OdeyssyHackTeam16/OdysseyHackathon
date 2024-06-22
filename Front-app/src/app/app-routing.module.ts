import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectwalletComponent } from './connectwallet/connectwallet.component';
import { NavComponent } from './nav/nav.component';
import { AdviserComponent } from './adviser/adviser.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { TokenIntegrationComponent } from './token-integration/token-integration.component';
import { NotauthComponent } from './notauth/notauth.component';
import {DashviewComponent} from "./dashview/dashview.component";

const routes: Routes = [
  { path: 'connect-wallet', component: ConnectwalletComponent },
  { path: 'dashboard', component: DashviewComponent },
  { path: 'connect-wallet', component: ConnectwalletComponent },
  { path: 'adviser', component: AdviserComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: '', redirectTo: '/connect-wallet', pathMatch: 'full' }, // Default redirect to dashboard
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
