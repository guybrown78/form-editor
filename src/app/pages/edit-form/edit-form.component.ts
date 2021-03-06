import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  SaveFormModel,
  SaveTypeEnum,
  TfNgFormEditorService
} from 'projects/tf-ng-form-editor/src/public-api';
// import { SaveFormModel, SaveTypeEnum, TfNgFormEditorService } from 'tf-ng-form-editor'

import { Subscription } from 'rxjs';
@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css']
})
export class EditFormComponent implements OnInit, OnDestroy {

  formSavedSubscription:Subscription;
  formCloseSubscription:Subscription;
  ready:boolean = false;
  constructor(
    private formEditorService: TfNgFormEditorService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const url = 'assets/forms/engineeringServiceLine.json'
    // const url = 'assets/forms/TraineeCADOperator_Americas.json'
    // const url = 'assets/forms/simple.json'


    this.formEditorService.getData(url).subscribe(data => {
      // data has loaded, the formService getData parses the data before it is returned here and stores the formFields, model and meta for the form.
      // console.log(data)
      // only thing left to do is listen for the submit button to be pressed
      this.initialiseFormSaveSubscription();
      this.initialiseFormCloseSubscription();
      this.ready = true;
    }, err => {
      // if the data can't load, then make the UI nice and show the user
      console.log("error loading data in controllong app")
      console.log(err);
    })


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

  initialiseFormCloseSubscription(){
    this.formCloseSubscription = this.formEditorService.close.subscribe((close:boolean) => {
      if(close){
        // handle form close - change route?
        console.log("form closed");
        this.router.navigate(['dashboard'])
      }
    })
  }

  canDeactivate(){
    return this.formEditorService.canDeactivate().then(result => {
      return result;
    })
  }

  ngOnDestroy(){
    this.formSavedSubscription.unsubscribe;
    this.formCloseSubscription.unsubscribe;
  }
}
