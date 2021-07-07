import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TfNgCoreModule } from 'tf-ng-core'
import { TfNgFormModule} from 'tf-ng-form'


import { TfNgFormEditorComponent } from './tf-ng-form-editor.component';
import { FieldPickerComponent } from './components/field-picker/field-picker.component';


import { NgZorroModule } from '../../../../src/app/modules/ng-zorro.module'

import { NavigationComponent } from './components/navigation/navigation.component';
import { NavigationSideBarComponent } from './components/navigation-side-bar/navigation-side-bar.component';
import { NavigationItemComponent } from './components/navigation-item/navigation-item.component';
import { MetaSettingsComponent } from './components/meta-settings/meta-settings.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { FieldItemComponent } from './components/field-item/field-item.component';
import { TreeItemComponent } from './components/tree-item/tree-item.component';
import { FieldDetailsComponent } from './components/field-details/field-details.component';
import { HeaderComponent } from './components/field-item/header/header.component';


@NgModule({
  declarations: [
    TfNgFormEditorComponent,
    FieldPickerComponent,
    NavigationComponent,
    NavigationSideBarComponent,
    NavigationItemComponent,
    MetaSettingsComponent,
    TreeViewComponent,
    FieldItemComponent,
    TreeItemComponent,
    FieldDetailsComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TfNgCoreModule,
    TfNgFormModule,
    NgZorroModule
  ],
  exports: [
    TfNgFormEditorComponent
  ]
})
export class TfNgFormEditorModule { }
