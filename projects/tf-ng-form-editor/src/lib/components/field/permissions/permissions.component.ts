import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TfNgFormPermissionInterface, TfNgFormPermissionService } from 'tf-ng-form';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  EditorItemModel
} from '../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';

@Component({
  selector: 'field-item-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  @Input('active') active:boolean

  private _editorItemModel:EditorItemModel
  @Input('editorItemModel') set editorItemModel(item:EditorItemModel){
    if(!this.active || (item.fieldItem.uuid !== this.fieldItem?.uuid)){
      // this.formReady = false;
      this.selectableItem = item.selectableItem;
      this.fieldItem = item.fieldItem;
      this.getPermissions()
    }
  }
  get editorItemModel():EditorItemModel{
    return this._editorItemModel
  }
  //
  allowSetPermissions:boolean;
  //
  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  // form: FormGroup;
  // formReady:boolean = false;

  // permissions
  availablePermissions:any[];
  selectedPermissions:number[];

  // read only
  availableReadOnlyPermissions:any[];
  selectedReadOnlyPermissions:number[];

  message:string = "The permissions for this form field are currently not set which is the default setting. This means that all user groups can read and write with this form field.";

  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    // private fb:FormBuilder,
    private formPermissionService:TfNgFormPermissionService,
    private modal:NzModalService
  ) { }

  ngOnInit(): void {}

  getPermissions(){
    this.formPermissionService.userPermissions.pipe(take(1)).subscribe( permissions => {

      if(permissions){
        // TODO set all as default
        this.selectedPermissions = this.fieldItem.permissions ? [ ...this.fieldItem.permissions ] : []//permissions.map(p => p.level)

        this.availablePermissions = permissions.map(p => {
          return {
            label:p.label,
            value:p.level,
            checked:this.selectedPermissions.includes(p.level)
          }
        })
      }else{
        this.availablePermissions = [];
      }
      //
      if(this.selectableItem.editableConfig.setReadonlyPermissions){
        this.getReadOnlyPermissions();
      } else {
        this.initSetPermissionsToggle();
      }
    })
  }

  getReadOnlyPermissions(){
    this.formPermissionService.userPermissions.pipe(take(1)).subscribe( permissions => {

      if(permissions){
        this.selectedReadOnlyPermissions = this.fieldItem.readonlyPermissions ? [ ...this.fieldItem.readonlyPermissions ] : []

        this.availableReadOnlyPermissions = permissions.map(p => {
          return {
            label:p.label,
            value:p.level,
            checked:this.selectedReadOnlyPermissions.includes(p.level)
          }
        })

      }else{
        this.availableReadOnlyPermissions = [];
      }
      this.initSetPermissionsToggle();
    })
  }
  initSetPermissionsToggle(){
    if(this.selectedPermissions.length || this.selectedReadOnlyPermissions.length){
      this.allowSetPermissions = true;
    }else{
      this.allowSetPermissions = false;
    }
  }
  // initForm(): void {
  //   this.form = this.fb.group({});

  //   // setPermissions
  //   if(this.selectableItem.editableConfig.setPermissions){
  //     this.form.addControl(
  //       'permissions',
  //       new FormControl(this.selectedPermissions, [])
  //     );
  //   }
  //   // setReadonlyPermissions
  //   if(this.selectableItem.editableConfig.setReadonlyPermissions){
  //     this.form.addControl(
  //       'readonlyPermissions',
  //       new FormControl(this.selectedReadOnlyPermissions, [])
  //     );
  //   }

  //   this.onChanges();
  //   this.formReady = true;
  // }

  // onChanges(): void {
  //   this.form.valueChanges.subscribe(val => {
  //     this.fieldItem = { ...this.fieldItem, ...this.form.value}
  //     this.formEditorService.updateFormItem(this.fieldItem)
  //   });
  // }

  toggleAllowSetPermissions(value:boolean){
    if(value){
      this.selectedReadOnlyPermissions = []
      this.selectedPermissions = this.availablePermissions.map(p => {
        return p.value
      })
    }else{
      this.selectedReadOnlyPermissions = []
      this.selectedPermissions = [];
      this.update();
    }
    this.allowSetPermissions = value
  }

  update(){
    this.fieldItem = {
      ...this.fieldItem,
      permissions:this.selectedPermissions,
      readonlyPermissions:this.selectedReadOnlyPermissions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }
  onPermissionUpdated(selected:any[]){
    this.selectedPermissions = [ ...selected ]
    this.update();
  }

  onReadOnlyPermissionUpdated(selected:any[]){
    this.selectedReadOnlyPermissions = [ ...selected ]
    this.update();
  }

  getLevelPermission(level){
    if(this.selectedReadOnlyPermissions.includes(level)){
      return "read-only"
    }
    if(!this.selectedPermissions.includes(level)){
      return "hidden"
    }
    return "fillable"
  }

  onPermissionSelected(permissionValue:string, permissionLevel:string){
    const level:number = Number(permissionLevel)
    let permissions:number[] = [ ...this.selectedPermissions ];
    let readonly:number[] = [ ...this.selectedReadOnlyPermissions  ];
    //
    if(permissionValue === 'read-only'){
      // needs to be added to permissions
      if(!permissions.includes(level)){
        permissions.push(level);
      }
      //
      if(!readonly.includes(level)){
        readonly.push(level)
      }
    }
    //
    if(permissionValue !== 'read-only'){
      // remove from readonly
      if(readonly.includes(level)){
        readonly = readonly.filter(c => c !== level)
      }
      //
      if(permissionValue === 'hidden'){
        if(permissions.includes(level)){
          permissions = permissions.filter(c => c !== level);
        }
      }else{
        if(!permissions.includes(level)){
          permissions.push(level);
        }
      }
    }
    this.selectedReadOnlyPermissions = [ ...readonly ]
    this.selectedPermissions = [ ...permissions ]
    if(!this.selectedPermissions.length){
      this.modal.warning({
        nzTitle: 'Permissions reverting to default settings',
        nzContent: `
          <p>You cannot set all user groups to 'hidden'. The permissions will be reverted back to the default setting</p>
        `,
        nzOkText:'Remove permissions',
        nzOnOk: () => {
          this.update()
          this.allowSetPermissions = false;
        }
      })
    }else{
      this.update();
    }
  }


}
