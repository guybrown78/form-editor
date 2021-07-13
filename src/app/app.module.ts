import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_GB } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TfNgCoreModule } from 'tf-ng-core';
import { TfNgNzModule } from 'tf-ng-nz';
import { TfNgFormModule } from 'tf-ng-form';
import { NgZorroModule } from './modules/ng-zorro.module';
//
import { TfNgFormEditorModule } from 'projects/tf-ng-form-editor/src/public-api';
//
import { PreviewFormComponent } from './pages/preview-form/preview-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { EditFormComponent } from './pages/edit-form/edit-form.component';
import { StatsComponent } from './pages/dashboard/stats/stats.component';


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PreviewFormComponent,
    DashboardComponent,
    CreateFormComponent,
    EditFormComponent,
    StatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TfNgCoreModule,
    TfNgNzModule,
    TfNgFormModule,
    NgZorroModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TfNgFormEditorModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_GB }],
  bootstrap: [AppComponent]
})
export class AppModule { }
