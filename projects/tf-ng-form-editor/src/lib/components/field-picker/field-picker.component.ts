import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

@Component({
  selector: 'form-editor-field-picker',
  templateUrl: './field-picker.component.html',
  styleUrls: ['./field-picker.component.css']
})
export class FieldPickerComponent {

  types: SelectableFieldItemModel[]

  @Output() selectedField = new EventEmitter<any>();

  form: FormGroup;
  readonly fieldEdit = new FormControl({});
  readonly type: FormControl;
  fieldGroup: boolean;

  constructor(
    fb: FormBuilder,
    private formEditorConfig:FormEditorConfigService
  ) {
    this.form = fb.group({
      type: this.type = fb.control('', Validators.compose([Validators.required, Validators.pattern(/^\s*\S.*$/)]))
    });
    this.types = [ ...formEditorConfig.types.filter(t => t.category === SelectableCategory.SIMPLE)]
  }

  add(): void {
    const selectedFieldItem:SelectableFieldItemModel = this.formEditorConfig.types.filter(t => t.id === this.form.value.type)[0];
    if(!selectedFieldItem){
      return
    }
    this.selectedField.emit(selectedFieldItem);
  }


}
