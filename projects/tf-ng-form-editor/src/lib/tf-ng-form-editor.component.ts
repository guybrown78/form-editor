import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tf-ng-form-editor',
  template: `
    <form-editor-field-picker (selected)="onFieldSelected($event)"></form-editor-field-picker>
  `,
  styles: [
  ]
})
export class TfNgFormEditorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onFieldSelected(field): void {
   //
   console.log("field selected ...")
   console.log(field);
}

}
