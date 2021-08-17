import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { combineAll, take } from 'rxjs/operators';
import { TfNgFormService } from 'tf-ng-form';
import { CheckFormMetaData, CheckFormMetaDataStatus, TfNgFormEditorService } from '../../tf-ng-form-editor.service';

import { FormMetaModel } from '../../to-share/form-meta-model.interface';
@Component({
  selector: 'form-editor-meta-settings',
  templateUrl: './meta-settings.component.html',
  styleUrls: ['./meta-settings.component.css']
})
export class MetaSettingsComponent implements OnInit, OnDestroy {

  metaForm: FormGroup;
  metaUpdateSubscription:Subscription;
  checkFormMetaInputSubscription:Subscription;
  metaData:FormMetaModel;
  loaded:boolean = false;
  metaFormUpdating: boolean = false;

  allowTitle:CheckFormMetaDataStatus = CheckFormMetaDataStatus.UNSET;
  allowCode:CheckFormMetaDataStatus = CheckFormMetaDataStatus.UNSET;

  returnedCheckedFormMetaData:CheckFormMetaData;


  constructor(
    private formEditorService:TfNgFormEditorService,
    private fb:FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.initialiseMetaUpdateSubscription();
    this.getMetaData()
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

  getMetaData(){
    // this.formSubscription =
    this.formEditorService.form.pipe(take(1)).subscribe(form => {
      if(form){
        this.metaData = form.meta;
        this.initForm();
        this.loaded = true;
      }
    }, err => {
      // TODO
    })
  }

  initForm(): void {
    this.metaForm = this.fb.group({
      title: [
        this.metaData.title,
        {
          validators: [Validators.required],
          updateOn: 'change'
        }
      ],
      showTitle:[
        this.metaData.showTitle || null,
        {
          updateOn: 'change'
        }
      ],
      code: [
        this.metaData.code || null,
        {
          validators: [Validators.required],
          updateOn: 'change'
        }
      ],
      version: [this.metaData.version]
    });
    this.metaForm.controls['version'].disable();
    this.metaForm.markAsPristine();
  }


  onMetaFormUpdate(){
    if(this.metaForm.valid){
      this.metaFormUpdating = true;
      this.returnedCheckedFormMetaData = {}
      // 1. check if title or code need checking?
      let check:number = 0;
      let checkMetaData:CheckFormMetaData = {}
      if(this.metaData.title !== this.metaForm.value.title){
        check++
        checkMetaData.title = this.metaForm.value.title
        checkMetaData.allowTitle = this.allowTitle = CheckFormMetaDataStatus.PENDING;
      }
      if(this.metaData.code !== this.metaForm.value.code){
        check++
        checkMetaData.code = this.metaForm.value.code
        checkMetaData.allowCode = this.allowCode = CheckFormMetaDataStatus.PENDING;
      }
      if(check > 0){
        // 2. if they do - send them to be checked
        this.checkFormMetaInputSubscription = this.formEditorService.checkFormMetaInput.subscribe((cmd) => {
          //
          this.checkFormMetaInputSubscription.unsubscribe();
          let allow:number = 0;
          //

          if(cmd){
            //
            this.returnedCheckedFormMetaData = cmd;
            //
            if(cmd.allowTitle){
              if(cmd.allowTitle === CheckFormMetaDataStatus.ALLOW){
                allow++;
                this.metaData = {
                  ...this.metaData,
                  title:cmd.title
                }
              }
              this.allowTitle = cmd.allowTitle
            }
            if(cmd.allowCode){
              if(cmd.allowCode === CheckFormMetaDataStatus.ALLOW){
                allow++
                this.metaData = {
                  ...this.metaData,
                  code:cmd.code
                }
              }
              this.allowCode = cmd.allowCode
            }
            if(allow === check){
              this.syncFormDataToModel();
            }else{
              // reset the updating state
              this.metaForm.markAsPristine();
              this.metaFormUpdating = false;
              // need to let user know what isn't correct

            }
          }else{
            // no data returned!
            this.metaForm.markAsPristine();
            this.metaFormUpdating = false;
          }


        })
        this.formEditorService.checkFormMetaDataOutput(checkMetaData)
      }else{
        // 3. if they don't - send the form to sync
        this.syncFormDataToModel();
      }

    }
  }

  // checkMetaData
  syncFormDataToModel(){
    this.metaForm.markAsPristine();
    this.metaFormUpdating = false;
    if((this.allowTitle !== 0 && this.allowTitle !== 2) && (this.allowCode !== 0 && this.allowCode !== 2)){
      this.metaData = { ...this.metaData, ...this.metaForm.value}
      this.formEditorService.updateMetaData(this.metaData);
      this.message.create('success', `Form meta data has been updated`);
    }
  }

  ngOnDestroy(){
    this.metaUpdateSubscription.unsubscribe;
    if(this.checkFormMetaInputSubscription){
      this.checkFormMetaInputSubscription.unsubscribe;
    }
  }

}
