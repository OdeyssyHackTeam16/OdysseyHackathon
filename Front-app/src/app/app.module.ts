import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IpfsService } from './ipfs.service';
import { NavComponent } from './nav/nav.component';
import {MaterialModule} from "./material/material.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DashviewComponent} from "./dashview/dashview.component";
import {InfoCardComponent} from "./info-card/info-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatGridListModule} from "@angular/material/grid-list";
import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import { ConnectwalletComponent } from './connectwallet/connectwallet.component';
import { NotauthComponent } from './notauth/notauth.component';
import {ReactiveFormsModule} from "@angular/forms";
import { AdviserComponent } from './adviser/adviser.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import {EtheruimService} from "./service/etheruim.service";
import { TokenIntegrationComponent } from './token-integration/token-integration.component';
import {ToastrModule, ToastrService} from "ngx-toastr";
const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 3,
  objectStoresMeta: [
    {
      store: 'consumption',
      storeConfig: { keyPath: 'date', autoIncrement: false },
      storeSchema: [
        { name: 'date', keypath: 'date', options: { unique: false } },
        { name: 'total', keypath: 'total', options: { unique: false } },
        { name: 'consumptionPerHour', keypath: 'consumptionPerHour', options: { unique: false } }
      ]
    }
  ]
};


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashviewComponent,
    InfoCardComponent,
    ConnectwalletComponent,
    NotauthComponent,
    AdviserComponent,
    AboutusComponent,
    TokenIntegrationComponent
  ],
    imports: [
        MaterialModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatGridListModule,
        NgxIndexedDBModule.forRoot(dbConfig),
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),

        MatDatepickerModule,
      MatFormFieldModule,
      MatInputModule,
      MatNativeDateModule,
      MatCardModule,
      ReactiveFormsModule
    ],
  providers: [IpfsService,EtheruimService],
  bootstrap: [AppComponent]
})
export class AppModule { }
