import { Component, Input, OnDestroy } from '@angular/core';
import { OrdinalDirectionEnum } from '../../tf-ng-form-editor.service';
import { Subscription } from 'rxjs';

import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';
import { NzTreeNode } from 'ng-zorro-antd/tree';

@Component({
  selector: 'form-editor-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnDestroy {
  @Input('node') node:NzTreeNode;

  // selectedKeySubscription:Subscription
  fieldItem:FieldItemModel
  popoverVisible: boolean = false;

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }


  // initialiseFormSubscription(){
  //   this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {
  //     if(key){
  //       this.isOpen = key === this.node.key;
  //     }else{
  //       this.isOpen = false;
  //     }
  //   })
  // }

  // onDetailsClicked(event){
  //   event.preventDefault();
  //   event.stopPropagation();
  // }



  stopButtonEvent(event){
    event.preventDefault();
    event.stopPropagation();
    setTimeout(() => {
      this.popoverVisible = false;
    }, 100);
  }

  onOrderUp(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.node.key, OrdinalDirectionEnum.UP, this.node.parentNode?.key);
  }
  onOrderDown(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.node.key, OrdinalDirectionEnum.DOWN, this.node.parentNode?.key);
  }
  onDuplicate(event){
    this.stopButtonEvent(event);
    this.formEditorService.duplicateFormItem(this.node.key, this.node.parentNode?.key)
  }
  onUser(event){
    this.stopButtonEvent(event);
  }
  onDelete(event){
    this.stopButtonEvent(event);
    this.formEditorService.deleteFormItem(this.node.key, this.node.parentNode?.key);
  }

  ngOnDestroy(){
    // this.selectedKeySubscription.unsubscribe
  }

}
