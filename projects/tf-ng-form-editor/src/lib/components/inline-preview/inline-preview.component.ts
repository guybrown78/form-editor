import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'form-editor-inline-preview',
  templateUrl: './inline-preview.component.html',
  styleUrls: ['./inline-preview.component.css']
})
export class InlinePreviewComponent implements OnInit {



  @Input('showInlinePreview') showInlinePreview:boolean;
  @Output('updatedShowInlinePreview') updatedShowInlinePreview = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit(): void {
  }

  onToggleShowInlinePreview(){
    this.updatedShowInlinePreview.emit(!this.showInlinePreview);
  }

}
