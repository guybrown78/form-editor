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
import { TfNgFormEditorModule, CanDeactivateGuard } from 'projects/tf-ng-form-editor/src/public-api';
// import { TfNgFormEditorModule } from 'tf-ng-form-editor'

// import { CanDeactivateGuard } from 'projects/tf-ng-form-editor/src/public-api';
// import { TfNgFormEditorModule } from 'tf-ng-form-editor'
//
import { PreviewFormComponent } from './pages/preview-form/preview-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { EditFormComponent } from './pages/edit-form/edit-form.component';
import { StatsComponent } from './pages/dashboard/stats/stats.component';
import { environment } from 'src/environments/environment';
import { ReviewFormComponent } from './pages/review-form/review-form.component';



registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    PreviewFormComponent,
    DashboardComponent,
    CreateFormComponent,
    EditFormComponent,
    StatsComponent,
    ReviewFormComponent,
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
    TfNgFormEditorModule//.forRoot({ froalaKey: environment.froalaKey })
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_GB },
    CanDeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
