import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TfNgFormService } from 'tf-ng-form';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';

import { FormMetaModel } from '../../to-share/form-meta-model.interface';
@Component({
  selector: 'form-editor-meta-settings',
  templateUrl: './meta-settings.component.html',
  styleUrls: ['./meta-settings.component.css']
})
export class MetaSettingsComponent implements OnInit {

  metaForm: FormGroup;
  metaUpdateSubscription:Subscription;
  metaData:FormMetaModel;
  loaded:boolean = false;

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
    this.onChanges();
  }

  onChanges(): void {
    this.metaForm.valueChanges.subscribe(val => {
      // console.log(this.metaForm.value)
      this.metaData = { ...this.metaData, ...this.metaForm.value}
      this.formEditorService.updateMetaData(this.metaData);
    });
  }

  destroy(){
    this.metaUpdateSubscription.unsubscribe;
  }

}
