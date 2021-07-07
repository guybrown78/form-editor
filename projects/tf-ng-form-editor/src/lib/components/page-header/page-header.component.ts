import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { EditorModeEnum, TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FormMetaModel } from '../../to-share/form-meta-model.interface';

@Component({
  selector: 'form-editor-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {


  metaUpdateSubscription:Subscription;
  editorModeSubscription:Subscription;

  metaData:FormMetaModel;
  editorMode:EditorModeEnum;
  loaded:boolean = false;

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    this.initialiseEditorModeSubscription();
    this.initialiseMetaUpdateSubscription();
    this.getMetaData();
  }

  initialiseMetaUpdateSubscription(){
    this.metaUpdateSubscription = this.formEditorService.metaUpdated.subscribe(updated => {
      if(updated){
        this.getMetaData();
      }
    }, err => {
      // TODO
    })
  }

  initialiseEditorModeSubscription(){
    this.editorModeSubscription = this.formEditorService.editorMode.subscribe((mode:EditorModeEnum) => {
      this.editorMode = mode;
    })
  }

  getMetaData(){
    // this.formSubscription =
    this.formEditorService.form.pipe(take(1)).subscribe(form => {
      if(form){
        this.metaData = form.meta;
        this.loaded = true;
      }
    }, err => {
      // TODO
    })
  }

  onModeToggle(){
    const mode:EditorModeEnum = this.editorMode === EditorModeEnum.EDIT ? EditorModeEnum.PREVIEW : EditorModeEnum.EDIT;
    this.formEditorService.setEditorMode(mode);
  }

  destroy(){
    this.metaUpdateSubscription.unsubscribe;
    this.editorModeSubscription.unsubscribe;
  }


}
