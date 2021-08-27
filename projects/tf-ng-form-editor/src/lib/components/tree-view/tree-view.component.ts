import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd/tree';
import { Subscription } from 'rxjs';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';




@Component({
  selector: 'form-editor-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})


// TODO add a noce right click to quickly delete, move up/down etc

export class TreeViewComponent implements OnInit, OnDestroy {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent

  // popoverVisible: boolean = false;
  formSubscription:Subscription
  nodes: NzTreeNodeOptions[];

  nzClick(event: NzFormatEmitEvent): void {
    this.formEditorService.setSelectedTreeKey(event.keys[0]);
  }

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    this.initialiseFormSubscription()
  }

  nzEvent(event: NzFormatEmitEvent): void {
    // console.log(event);
  }

  initialiseFormSubscription(){
    this.formSubscription = this.formEditorService.formTree.subscribe(tree => {
      this.nodes = [ ...tree ];
    })
  }

  onSupressExpansion(event){
    event.stopPropagation();
    event.preventDefault();
  }
  ngOnDestroy(){
    this.formSubscription.unsubscribe
  }

}
