import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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

  constructor(
    private formEditorService:TfNgFormEditorService,
    private fb:FormBuilder
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
      title: [this.metaData.title, [Validators.required]],
      showTitle:[this.metaData.showTitle || null],
      code: [this.metaData.code || null, [Validators.required]],
      version: [this.metaData.version]
    });
    this.metaForm.controls['version'].disable();
    this.metaForm.markAsUntouched();
    // this.onChanges();
  }

  // onChanges(): void {
  //   this.metaForm.valueChanges.subscribe(val => {
  //     // console.log(this.metaForm.value)
  //     this.metaData = { ...this.metaData, ...this.metaForm.value}
  //     this.formEditorService.updateMetaData(this.metaData);
  //   });
  // }

  onMetaFormUpdate(){
    if(this.metaForm.valid){
      this.metaFormUpdating = true;
      // 1. check if title or code need checking?
      let check:number = 0;
      let checkMetaData:CheckFormMetaData = {}
      if(this.metaData.title !== this.metaForm.value.title){
        check++
        checkMetaData.title = this.metaForm.value.title
        checkMetaData.allowTitle = CheckFormMetaDataStatus.PENDING;
      }
      if(this.metaData.code !== this.metaForm.value.code){
        check++
        checkMetaData.code = this.metaForm.value.code
        checkMetaData.allowCode = CheckFormMetaDataStatus.PENDING;
      }
      if(check > 0){
        // 2. if they do - send them to be checked
        this.checkFormMetaInputSubscription = this.formEditorService.checkFormMetaInput.subscribe((cmd) => {
          //
          this.checkFormMetaInputSubscription.unsubscribe();
          let allow:number = 0;
          //
          if(cmd.allowTitle){
            if(cmd.allowTitle === CheckFormMetaDataStatus.ALLOW){
              allow++
            }
          }
          if(cmd.allowCode){
            if(cmd.allowCode === CheckFormMetaDataStatus.ALLOW){
              allow++
            }
          }
          if(allow === check){
            this.syncFormDataToModel();
          }else{
            // reset
            this.metaForm.markAsUntouched();
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
    this.metaData = { ...this.metaData, ...this.metaForm.value}
    this.formEditorService.updateMetaData(this.metaData);
    this.metaForm.markAsUntouched();
    this.metaFormUpdating = false;
  }

  ngOnDestroy(){
    this.metaUpdateSubscription.unsubscribe;
  }

}
