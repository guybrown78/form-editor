import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    private formEditorService: TfNgFormEditorService,
    private message: NzMessageService,
    private router: Router
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
