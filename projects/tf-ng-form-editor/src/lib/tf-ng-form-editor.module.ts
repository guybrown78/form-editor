import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TfNgFormEditorComponent } from './tf-ng-form-editor.component';
import { FieldPickerComponent } from './components/field-picker/field-picker.component';



@NgModule({
  declarations: [
    TfNgFormEditorComponent,
    FieldPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TfNgFormEditorComponent
  ]
})
export class TfNgFormEditorModule { }
