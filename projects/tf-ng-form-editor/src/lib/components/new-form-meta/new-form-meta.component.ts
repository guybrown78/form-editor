import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CheckFormMetaData, CheckFormMetaDataStatus, TfNgFormEditorService } from '../../tf-ng-form-editor.service';

import { FormMetaModel } from '../../to-share/form-meta-model.interface';

@Component({
  selector: 'form-editor-new-form',
  templateUrl: './new-form-meta.component.html',
  styleUrls: ['./new-form-meta.component.css']
})
export class NewFormMetaComponent implements OnInit {

  metaForm: FormGroup;
  // metaUpdateSubscription:Subscription;
  checkFormMetaInputSubscription:Subscription;
  metaData:FormMetaModel;
  loaded:boolean = false;
  metaFormUpdating: boolean = false;

  allowTitle:CheckFormMetaDataStatus = CheckFormMetaDataStatus.UNSET;
  allowCode:CheckFormMetaDataStatus = CheckFormMetaDataStatus.UNSET;

  returnedCheckedFormMetaData:CheckFormMetaData;

  @Output('formInited') formInited = new EventEmitter<boolean>();

  constructor(
    private formEditorService:TfNgFormEditorService,
    private fb:FormBuilder,
  ) { }

  ngOnInit(): void {
    this.metaData = {
      title:null,
      code:null,
      showTitle:true,
      version:"1"
    }
    this.initForm();
  }


  initForm(): void {
    this.metaForm = this.fb.group({
      title: [this.metaData.title,[Validators.required]],
      showTitle:[this.metaData.showTitle],
      code: [this.metaData.code,[Validators.required]],
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
              this.setMetaData();
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
        this.setMetaData();
      }

    }
  }


  setMetaData(){
    this.formEditorService.initialiseNewForm({
      ...this.metaForm.value,
      jsonSchema:true
    });
    // reset the updating state
    this.metaForm.markAsPristine();
    this.metaFormUpdating = false;
    // output
    this.formInited.emit(true);

  }

  ngOnDestroy(){
    // this.metaUpdateSubscription.unsubscribe;
    if(this.checkFormMetaInputSubscription){
      this.checkFormMetaInputSubscription.unsubscribe
    }
  }


}
