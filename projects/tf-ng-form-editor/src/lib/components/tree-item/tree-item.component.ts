import { Component, Input, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
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
    private formEditorService:TfNgFormEditorService,
    private modal: NzModalService
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

    this.modal.confirm({
      nzTitle: '<b>Delete Item?</b>',
      nzContent: `
        <p>Deleting this item will remove it, and all it's children from the form schema.</p>
       `,
      nzOnOk: () => {
        this.formEditorService.deleteFormItem(this.node.key, this.node.parentNode?.key);
      }
    });


  }

  ngOnDestroy(){
    // this.selectedKeySubscription.unsubscribe
  }

}
