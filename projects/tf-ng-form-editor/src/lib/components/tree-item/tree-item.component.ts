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
  @Input('node') node:FormTreeModel;
  @Input('isOpen') isOpen:boolean;

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
        this.isOpen = key === this.node.key;
      }else{
        this.isOpen = false;
      }
    })
  }

  onDetailsClicked(event){
    event.preventDefault();
    event.stopPropagation();
  }

  destroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
