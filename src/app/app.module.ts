import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_GB } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TfNgCoreModule } from 'tf-ng-core';
import { TfNgNzModule } from 'tf-ng-nz';
import { TfNgFormModule } from 'tf-ng-form';
import { NgZorroModule } from './modules/ng-zorro.module'

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TfNgCoreModule,
    TfNgNzModule,
    TfNgFormModule,
    NgZorroModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_GB }],
  bootstrap: [AppComponent]
})
export class AppModule { }
