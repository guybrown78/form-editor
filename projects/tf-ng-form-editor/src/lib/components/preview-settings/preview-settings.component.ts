import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  DisplayJsonService,
  TfNgFormService,
  TfNgFormPermissionService,
  TfNgFormPermissionInterface
} from 'tf-ng-form';
import { take } from 'rxjs/operators';
import { EditorModeEnum, TfNgFormEditorService } from '../../tf-ng-form-editor.service';
@Component({
  selector: 'form-editor-preview-settings',
  templateUrl: './preview-settings.component.html',
  styleUrls: ['./preview-settings.component.css']
})
export class PreviewSettingsComponent implements OnInit {

  // selectedPermission:TfNgFormPermissionInterface;
  selectedPermissionLevel:Number;
  permissions:TfNgFormPermissionInterface[];

  constructor(
    private formService:TfNgFormService,
    private displayJsonService:DisplayJsonService,
    private formPermissionService:TfNgFormPermissionService,
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
    // get the available permissions
    this.formPermissionService.userPermissions.pipe(take(1)).subscribe( permissions => {
      this.permissions = permissions;

      this.formPermissionService.userPermissionLevel.pipe(take(1)).subscribe(level => {
        // this.formPermissionService.setUserPermissionLevel(level);
        this.selectedPermissionLevel = level;
        setTimeout(() => {
          this.updateForm();
        }, 0)
      })
    })
  }

  onPermissionChange(value){
    this.formPermissionService.setUserPermissionLevel(value);
    // reload
    this.updateForm()
  }

  updateForm(){
    this.formEditorService.form.pipe(take(1)).subscribe(form => {
      // stringify and set to json
      if(form){
        this.formService.setData(JSON.stringify(form)).subscribe(data => {
          // CAN UPDATE PREVIEW HERE
        })
      }
    })
  }
  showFormSource(){
    // for dev purposes, display the json nicely
    this.formService.data.pipe(take(1)).subscribe(
     data => {
       this.displayJsonService.show(JSON.stringify(data), "Form JSON source");
     }
   )

 }

}
