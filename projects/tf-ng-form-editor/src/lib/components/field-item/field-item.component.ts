import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'form-editor-field-item',
  templateUrl: './field-item.component.html',
  styleUrls: ['./field-item.component.css']
})
export class FieldItemComponent implements OnInit {
  @Input('key') key:string;

  constructor() { }

  ngOnInit(): void {
  }

}
