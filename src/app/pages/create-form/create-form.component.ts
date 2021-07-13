import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EditorModeEnum, SaveFormModel, SaveTypeEnum, TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/public-api';
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

  initialiseFormCloseSubscription(){
    this.formCloseSubscription = this.formEditorService.close.subscribe((close:boolean) => {
      if(close){
        // handle form close - change route?
        console.log("form closed");
        this.router.navigate(['dashboard'])
      }
    })
  }

  destroy(){
    this.formSavedSubscription.unsubscribe;
    this.formCloseSubscription.unsubscribe;
  }

}
