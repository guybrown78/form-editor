import { Component, OnDestroy, OnInit } from '@angular/core';
import { TfNgFormService } from 'tf-ng-form';
import { EditorModeEnum, TfNgFormEditorService } from './tf-ng-form-editor.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tf-ng-form-editor',
  templateUrl: './tf-ng-form-editor.component.html',
  styleUrls: ['./tf-ng-form-editor.component.css']
})
export class TfNgFormEditorComponent implements OnInit, OnDestroy {

  formSubscription:Subscription
  editorModeSubscription:Subscription;
  // formReady:boolean = false

  editorMode:EditorModeEnum;

  showInlinePreview:boolean = true;

  ready:boolean = false;
  initForm:boolean = false;

  hasTabs:boolean = false;
  hasFormSchema:boolean = false;

  onShowInlinePreviewUpdated(value:boolean){
    this.showInlinePreview = value;
  }

  constructor(
    private formService:TfNgFormService,
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    //
    this.initialiseEditorModeSubscription();
    // check if the form model has been initialised
    this.formEditorService.form.pipe(take(1)).subscribe(form => {
      if(form){
        this.initialiseFormSubscription();
      }else{
        setTimeout(() => {
          this.initForm = true;
        }, 500);
      }
    }, formError => {
      console.log("Form Editor service subscription error");
    })
  }

  onFormCreated(){
    this.initForm = false;
    setTimeout(() => {
      this.initialiseFormSubscription();
    }, 500);
  }
  initialiseFormSubscription(){
    this.formSubscription = this.formEditorService.form.subscribe(form => {
      // get current form
      this.formEditorService.form.pipe(take(1)).subscribe(form => {
        // stringify and set to json
        if(form){
          let hasTabs = false;
          form.schema.map(rootItem => {
            if(rootItem.type === 'tabs'){
              hasTabs = true;
            }
          })
          this.hasTabs = hasTabs;
          this.hasFormSchema = form.schema.length > 0;

          this.formService.setData(JSON.stringify(form)).subscribe(data => {
            // CAN UPDATE PREVIEW HERE
          })
        }

      })
    });

    setTimeout(() => {
      this.ready = true;
    }, 500);
  }

  initialiseEditorModeSubscription(){
    this.editorModeSubscription = this.formEditorService.editorMode.subscribe((mode:EditorModeEnum) => {

      // the inline preview forces the title and form width to be ignored so it fills the preview window. That sticks in the formservice so just reset when wanting the full preview
      if(mode === EditorModeEnum.PREVIEW){
        this.editorMode = EditorModeEnum.NONE;
        setTimeout(() => {
          this.formService.forceFullFormWidth = false;
          this.formService.forceHideFormTitle = false;
          this.editorMode = mode;
        }, 50);
      }else{
        this.editorMode = mode;
      }
    })
  }



  ngOnDestroy(){
    // the inline preview forces the title and form width to be ignored so it fills the preview window. That sticks in the formservice so just reset when leaving
    this.formService.forceFullFormWidth = false;
    this.formService.forceHideFormTitle = false;
    //
    if(this.formSubscription){
      this.formSubscription.unsubscribe;
    }
    if(this.editorModeSubscription){
      this.editorModeSubscription.unsubscribe;
    }
  }

}
