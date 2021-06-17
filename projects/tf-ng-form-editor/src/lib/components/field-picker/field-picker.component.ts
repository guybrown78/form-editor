import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'form-editor-field-picker',
  templateUrl: './field-picker.component.html',
  styleUrls: ['./field-picker.component.css']
})
export class FieldPickerComponent {

  types: string[] = [
    "input",
    "select"
  ];

  @Output() selected = new EventEmitter<any>();

  form: FormGroup;
  readonly fieldEdit = new FormControl({});
  readonly type: FormControl;
  fieldGroup: boolean;

  constructor(
    fb: FormBuilder,
  ) {
    this.form = fb.group({
      type: this.type = fb.control('', Validators.compose([Validators.required, Validators.pattern(/^\s*\S.*$/)]))
    });
  }

  add(): void {
    console.log("add");
  }


}
