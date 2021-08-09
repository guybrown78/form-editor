import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzTreeComponent, NzTreeNodeOptions, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { Subscription } from 'rxjs';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';

@Component({
  selector: 'form-editor-tree-dev',
  templateUrl: './tree-dev.component.html',
  styleUrls: ['./tree-dev.component.css']
})
export class TreeDevComponent implements OnInit, OnDestroy {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent

  formSubscription:Subscription
  nodes: NzTreeNodeOptions[];

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    this.initialiseFormSubscription()
  }

  initialiseFormSubscription(){
    this.formSubscription = this.formEditorService.formTree.subscribe(tree => {
      this.nodes = [ ...tree ];
    })
  }

  nzClick(event: NzFormatEmitEvent): void {
    this.formEditorService.setSelectedTreeKey(event.keys[0]);
  }

  ngOnDestroy(){
    this.formSubscription.unsubscribe
  }

}
