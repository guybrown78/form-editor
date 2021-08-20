import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { TfNgFormPermissionInterface, TfNgFormPermissionService } from 'tf-ng-form';
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
      this.formReady = false;
      this.selectableItem = item.selectableItem;
      this.fieldItem = item.fieldItem;
      this.getPermissions()
    }
  }
  get editorItemModel():EditorItemModel{
    return this._editorItemModel
  }

  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  form: FormGroup;
  formReady:boolean = false;

  // permissions
  availablePermissions:any[];
  selectedPermissions:number[];

  // read only
  availableReadOnlyPermissions:any[];
  selectedReadOnlyPermissions:number[];


  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder,
    private formPermissionService:TfNgFormPermissionService
  ) { }

  ngOnInit(): void {}

  getPermissions(){
    this.formPermissionService.userPermissions.pipe(take(1)).subscribe( permissions => {

      if(permissions){
        this.selectedPermissions = this.fieldItem.permissions ? [ ...this.fieldItem.permissions ] : []

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
        this.initForm();
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
      this.initForm();
    })
  }

  initForm(): void {
    this.form = this.fb.group({});

    // setPermissions
    if(this.selectableItem.editableConfig.setPermissions){
      this.form.addControl(
        'permissions',
        new FormControl(this.selectedPermissions, [])
      );
    }
    // setReadonlyPermissions
    if(this.selectableItem.editableConfig.setReadonlyPermissions){
      this.form.addControl(
        'readonlyPermissions',
        new FormControl(this.selectedReadOnlyPermissions, [])
      );
    }

    this.onChanges();
    this.formReady = true;
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = { ...this.fieldItem, ...this.form.value}
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }

  onPermissionUpdated(selected:any[]){
    this.form.controls['permissions'].setValue(selected);
  }

  onReadOnlyPermissionUpdated(selected:any[]){
    this.form.controls['readonlyPermissions'].setValue(selected);
  }

}
