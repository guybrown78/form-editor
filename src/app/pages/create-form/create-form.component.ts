import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  CheckFormMetaData,
  CheckFormMetaDataStatus,
  EditorModeEnum,
  SaveFormModel,
  SaveTypeEnum,
  TfNgFormEditorService
} from 'projects/tf-ng-form-editor/src/public-api';
// import { CheckFormMetaData, CheckFormMetaDataStatus, EditorModeEnum, SaveFormModel, SaveTypeEnum, TfNgFormEditorService } from 'tf-ng-form-editor'
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
//

//
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  @ViewChild("modalContent") modalContent: TemplateRef<any>;

  formSavedSubscription:Subscription;
  formCloseSubscription:Subscription;
  checkFormMetaInputSubscription:Subscription;
  loaded:boolean = false;

  // keep an instance of the check model to sync with the form editor and return back
  returnedMetaDataCheck:CheckFormMetaData


  constructor(
    private formEditorService: TfNgFormEditorService,
    private message: NzMessageService,
    private router: Router,
    private modal:NzModalService
  ) { }

  ngOnInit(): void {
    // start with no data ...
    // nullifyForm makes the form === null

   this.formEditorService.nullifyForm().subscribe(
     nullified => {

        // or you can reset the form which makes it === to the blank dafualt formModel. Note, resetting the form incorporates nullifyForm
        // this.formEditorService.resetForm().subscribe(
        //   reset => {

            // example on how to ensure the editor opens in editor mode
            this.formEditorService.setEditorMode(EditorModeEnum.EDIT);
            this.initialiseFormSaveSubscription();
            this.initialiseFormCloseSubscription();
            this.initialiseFormMetaCheckSubscription()
            this.loaded = true;

        //   }
        // );

     }
   );

  }


  initialiseFormSaveSubscription(){
    this.formSavedSubscription = this.formEditorService.save.subscribe((data:SaveFormModel) => {
      if(data){
        if(data.type === SaveTypeEnum.DRAFT){
          console.log("Save as DRAF", data.data);
          this.message.create('success', `Your form has been saved as ${data.type}`);
        }else if(data.type === SaveTypeEnum.PUBLISH){
          console.log("PUBLISH", data.data)
          this.message.create('success', `Your form has been saved and published`);
        }
      }
    })
  }

  initialiseFormMetaCheckSubscription(){
    this.checkFormMetaInputSubscription = this.formEditorService.checkFormMetaOutput.subscribe((data:CheckFormMetaData) => {

      // sync the views model to match the form editor
      this.returnedMetaDataCheck = { ...data }

      // for demo purposes, set the allow flags to DISALLOW (false) beacuse the demo uses a switch true/false
      if(data.allowTitle === CheckFormMetaDataStatus.PENDING){
        this.returnedMetaDataCheck.allowTitle = CheckFormMetaDataStatus.DISALLOW
      }
      if(data.allowCode === CheckFormMetaDataStatus.PENDING){
        this.returnedMetaDataCheck.allowCode = CheckFormMetaDataStatus.DISALLOW
      }

      // show a example modal for demo purposes to allow/disallow meta data
      this.modal.confirm({
        nzTitle: 'Confirm form meta data',
        nzClassName:"tf-app-modal-single-btn",
        nzContent: this.modalContent,
        nzCancelText:null,
        nzClosable:false,
        nzOkText:'Confirm',
        nzOnOk: () => {
          this.returnedMetaDataCheck.titleErrMessage = `The form title '${this.returnedMetaDataCheck.title}' conflicts with another form title in our system. Please change and try again.`
          this.formEditorService.checkFormMetaDataInput(this.returnedMetaDataCheck);
          this.returnedMetaDataCheck = null;
        }
      })

    })
  }

  initialiseFormCloseSubscription(){
    this.formCloseSubscription = this.formEditorService.close.subscribe((close:boolean) => {
      if(close){
        // handle form close - change route?
        console.log("form closed");
        this.router.navigate(['dashboard'])
      }
    })
  }


  onMetaSwitchUpdate(selected:boolean, type:string){
    if(type === 'title'){
      this.returnedMetaDataCheck.allowTitle = selected ? CheckFormMetaDataStatus.ALLOW : CheckFormMetaDataStatus.DISALLOW
    }
    if(type === 'code'){
      this.returnedMetaDataCheck.allowCode = selected ? CheckFormMetaDataStatus.ALLOW : CheckFormMetaDataStatus.DISALLOW;
    }
  }

  canDeactivate(){
    return this.formEditorService.canDeactivate().then(result => {
      return result;
    })
  }

  ngOnDestroy(){
    this.formSavedSubscription.unsubscribe();
    this.formCloseSubscription.unsubscribe();
    this.checkFormMetaInputSubscription.unsubscribe();
  }

}
