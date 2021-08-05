import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TfNgFormService } from 'tf-ng-form';
@Component({
  selector: 'form-editor-inline-preview',
  templateUrl: './inline-preview.component.html',
  styleUrls: ['./inline-preview.component.css']
})
export class InlinePreviewComponent implements OnInit {



  @Input('showInlinePreview') showInlinePreview:boolean;
  @Output('updatedShowInlinePreview') updatedShowInlinePreview = new EventEmitter<boolean>()


  dataSubscription:Subscription;
  hasFields:boolean = false;

  constructor(
    private formService:TfNgFormService,
  ) { }

  ngOnInit(): void {
    this.dataSubscription = this.formService.data.subscribe(
      data => {
        this.hasFields = this.formService.fields.length > 0;
        console.log(this.hasFields)
      }, dataErr => {
        this.hasFields = false;
      }
    )
  }

  onToggleShowInlinePreview(){
    this.updatedShowInlinePreview.emit(!this.showInlinePreview);
  }

  destroy(){
    this.dataSubscription.unsubscribe();
  }
}
