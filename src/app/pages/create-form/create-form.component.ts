import { Component, OnInit } from '@angular/core';
import { SaveFormModel, SaveTypeEnum, TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/public-api';
import { Subscription } from 'rxjs';
//

//
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit {

  formSavedSubscription:Subscription;
  formCloseSubscription:Subscription;

  constructor(
    private formEditorService:TfNgFormEditorService,

  ) { }

  ngOnInit(): void {
    this.initialiseFormSaveSubscription();
    this.initialiseFormCloseSubscription();
  }


  initialiseFormSaveSubscription(){
    this.formSavedSubscription = this.formEditorService.save.subscribe((data:SaveFormModel) => {
      if(data){
        if(data.type === SaveTypeEnum.DRAFT){
          console.log("Save as DRAF", data.data);
        }else if(data.type === SaveTypeEnum.PUBLISH){
          console.log("PUBLISH", data.data)
        }
      }
    })
  }

  initialiseFormCloseSubscription(){
    this.formCloseSubscription = this.formEditorService.close.subscribe((close:boolean) => {
      if(close){
        // handle form close - change route?
        console.log("form closed");
      }
    })
  }

  destroy(){
    this.formSavedSubscription.unsubscribe;
    this.formCloseSubscription.unsubscribe;
  }

}
