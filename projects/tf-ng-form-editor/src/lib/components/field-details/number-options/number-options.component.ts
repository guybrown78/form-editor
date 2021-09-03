import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'form-editor-number-options',
  templateUrl: './number-options.component.html',
  styleUrls: ['./number-options.component.css']
})
export class NumberOptionsComponent implements OnInit {

  minValue = -Infinity;
  maxValue = Infinity;
  constructor() { }

  ngOnInit(): void {
  }

}
