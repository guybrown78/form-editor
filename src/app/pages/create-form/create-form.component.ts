import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CheckFormMetaData, CheckFormMetaDataStatus, EditorModeEnum, SaveFormModel, SaveTypeEnum, TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/public-api';
import { Subscription } from 'rxjs';
//

//
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit, OnDestroy {

  formSavedSubscription:Subscription;
  formCloseSubscription:Subscription;
  checkFormMetaInputSubscription:Subscription;
  loaded:boolean = false;

  constructor(
    private formEditorService: TfNgFormEditorService,
    private message: NzMessageService,
    private router: Router
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
      //
      console.log(data);
      const returnedData:CheckFormMetaData = { ...data }
      if(data.allowTitle === CheckFormMetaDataStatus.PENDING){
        console.log(`Check form data title that '${data.title}' is allowed!`)
        // assume it is allowed
        returnedData.allowTitle = CheckFormMetaDataStatus.ALLOW
      }
      if(data.allowCode === CheckFormMetaDataStatus.PENDING){
        console.log(`Check form data code that '${data.code}' is allowed!`)
        // assume it is allowed
        returnedData.allowCode = CheckFormMetaDataStatus.ALLOW
      }
      setTimeout(() => {
        // send it back with a fake TEMPORARY timeout
        this.formEditorService.checkFormMetaDataInput(returnedData)
      }, 750);

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

  ngOnDestroy(){
    this.formSavedSubscription.unsubscribe();
    this.formCloseSubscription.unsubscribe();
    this.checkFormMetaInputSubscription.unsubscribe();
  }

}
