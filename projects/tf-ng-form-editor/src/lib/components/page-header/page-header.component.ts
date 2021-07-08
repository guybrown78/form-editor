import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { take } from 'rxjs/operators';
import { EditorModeEnum, SaveTypeEnum, TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FormMetaModel } from '../../to-share/form-meta-model.interface';

@Component({
  selector: 'form-editor-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {


  metaUpdateSubscription:Subscription;
  formUpdateSubscription:Subscription;
  editorModeSubscription:Subscription;

  metaData:FormMetaModel;
  editorMode:EditorModeEnum;
  loaded:boolean = false;
  disabledSave:boolean = true;

  constructor(
    private formEditorService:TfNgFormEditorService,
    private modal:NzModalService
  ) { }

  ngOnInit(): void {
    this.initialiseEditorModeSubscription();
    this.initialiseMetaUpdateSubscription();
    this.initialiseFormUpdateSubscription();
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


  initialiseFormUpdateSubscription(){
    this.formUpdateSubscription = this.formEditorService.formUpdated.subscribe(updated => {
      if(updated){
        // changes have been made, able to save
        this.disabledSave = false;
      }
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

  onDraftSave(){
    this.onSave(SaveTypeEnum.DRAFT)
  }
  onPublishSave(){
    this.onSave(SaveTypeEnum.PUBLISH)
  }
  onSave(type:SaveTypeEnum){
    this.disabledSave = true;
    this.formEditorService.saveForm(type);
  }

  onClose(){



    if(!this.disabledSave){
      this.modal.create({
        nzTitle: 'Close form editor',
        nzContent: `
          <p>You have unsaved changes to your form.</p>
          <p>If you close this form without saving, you will loose your changes.</p>
          <p>Are you sure you want to close and loose the changes?</p>`,
        nzCancelText:'Cancel',
        nzOnCancel: () => this.handleCancelClose(),
        nzOkText:'Yes, Close form without saving',
        nzOnOk: () => this.formEditorService.closeFormEditor()
      })
		}else{
      this.formEditorService.closeFormEditor();
    }

  }

  handleCancelClose(){
    // console.log("CANCEL")
	}
  destroy(){
    this.metaUpdateSubscription.unsubscribe;
    this.editorModeSubscription.unsubscribe;
    this.formUpdateSubscription.unsubscribe;
  }


}
