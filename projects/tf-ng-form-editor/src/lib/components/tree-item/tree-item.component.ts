import { Component, Input, OnInit } from '@angular/core';
import { FormTreeModel } from '../../tf-ng-form-editor.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

@Component({
  selector: 'form-editor-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit {
  @Input() node:FormTreeModel;

  selectedKeySubscription:Subscription
  fieldItem:FieldItemModel

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    this.formEditorService.getFieldItemFromTreeKey(this.node.key).subscribe(
      item => {
        this.fieldItem = item;
        this.initialiseFormSubscription()
      }
    )
  }

  initialiseFormSubscription(){
    this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {
      if(key){
        this.node.selected = key === this.node.key;
      }
    })
  }

  destroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
