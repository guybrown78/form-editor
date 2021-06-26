import { Component, OnInit } from '@angular/core';
import { TfNgFormService } from 'tf-ng-form';
import { TfNgFormEditorService } from './tf-ng-form-editor.service';
import { FormEditorConfigService, SelectableFieldItemModel } from './form-editor-config.service';
import { FieldItemModel } from './to-share/field-item-model.interface';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tf-ng-form-editor',
  templateUrl: './tf-ng-form-editor.component.html',
  styleUrls: ['./tf-ng-form-editor.component.css']
})
export class TfNgFormEditorComponent implements OnInit {

  formSubscription:Subscription
  // formReady:boolean = false


  constructor(
    private formService:TfNgFormService,
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {

    // check if the form model has been initialised
    this.formEditorService.form.pipe(take(1)).subscribe(form => {
      if(form){
        console.log("form has been initialised...");
        this.initialiseFormSubscription();
      }else{
        this.formEditorService.initialiseNewForm({
          title:"New form",
          version:"001",
          jsonSchema:true
        });
        this.initialiseFormSubscription();
      }
    }, formError => {
      console.log("Form Editor service subscription error");
    })
  }

  initialiseFormSubscription(){
    this.formSubscription = this.formEditorService.form.subscribe(form => {
      // get current form
      this.formEditorService.form.pipe(take(1)).subscribe(form => {
        // stringify and set to json
        // this.formService.setData(JSON.stringify(form)).subscribe(data => {
          // CAN UPDATE PREVIEW HERE
          //
        // })
      })

    })
  }

  destroy(){
    this.formSubscription.unsubscribe;
  }

}
