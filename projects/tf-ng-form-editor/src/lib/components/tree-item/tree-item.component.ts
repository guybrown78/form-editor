import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { OrdinalDirectionEnum } from '../../tf-ng-form-editor.service';
import { Subscription } from 'rxjs';

import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';
import { NzTreeNode } from 'ng-zorro-antd/tree';
import { take } from 'rxjs/operators';

@Component({
  selector: 'form-editor-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.css']
})
export class TreeItemComponent implements OnInit, OnDestroy {
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

  ngOnInit(){
    this.formEditorService.getFieldItemFromTreeKey(this.node.key).pipe(take(1)).subscribe(item => {
      if(item){
        this.fieldItem = item;
      }
    })
  }

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
    if(this.fieldItem.type === 'tabs' || this.fieldItem.type === 'tab'){
      return;
    }
    this.formEditorService.duplicateFormItem(this.node.key, this.node.parentNode?.key)
  }
  onUser(event){
    this.stopButtonEvent(event);
  }
  onDelete(event){
    this.stopButtonEvent(event);
    const maskStyle = {
      backgroundColor:'rgb(34,69,149, 0.8)',
      overflow:'auto'
    }

    let msg = "<p>Are you sure you want to delete the selected item?</p>"//`<p>This will delete the ${ this.fieldItem.label } item of the form. </p>`;
    // if(this.fieldItem.fieldGroup.length > 0){
    //   msg = `<p>This will delete the ${ this.fieldItem.label } item of the form including all form inputs within it.</p>`
    // }
    // if(this.fieldItem.type === "tab"){
    //   msg = `<p>This will delete all the ${ this.fieldItem.label } section and inputs within the form. </p>`
    // }

    this.modal.confirm({
      // nzTitle: `<b>Delete ${ this.node.title  }?</b>`,
      nzTitle: `<b>Are you sure?</b>`,
      nzContent: msg,
      nzOkText:'Yes, delete it',
      nzMaskStyle:maskStyle,
      nzOnOk: () => {
        this.formEditorService.deleteFormItem(this.node.key, this.node.parentNode?.key);
      }
    });


  }

  ngOnDestroy(){
    // this.selectedKeySubscription.unsubscribe
  }

}
