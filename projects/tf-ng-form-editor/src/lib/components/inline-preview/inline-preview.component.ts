import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { TfNgFormService } from 'tf-ng-form';
@Component({
  selector: 'form-editor-inline-preview',
  templateUrl: './inline-preview.component.html',
  styleUrls: ['./inline-preview.component.css']
})
export class InlinePreviewComponent implements OnInit, OnDestroy {



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
      }, dataErr => {
        this.hasFields = false;
      }
    )
  }

  onToggleShowInlinePreview(){
    this.updatedShowInlinePreview.emit(!this.showInlinePreview);
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe();
  }
}
