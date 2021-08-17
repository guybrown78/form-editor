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

// label: string;
// value: string;
// checked?: boolean;


@Component({
  selector: 'field-item-config-options',
  templateUrl: './config-options.component.html',
  styleUrls: ['./config-options.component.css']
})
export class ConfigOptionsComponent implements OnInit {

  private _editorItemModel:EditorItemModel
  @Input('editorItemModel') set editorItemModel(item:EditorItemModel){
    if(item.fieldItem.uuid !== this.fieldItem?.uuid){
      this.formReady = false;
      this.selectableItem = item.selectableItem;
      this.fieldItem = item.fieldItem;
      if(this.selectableItem.editableConfig.setPermissions){
        this.getPermissions()
      }else{
        this.initForm();
      }
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
    // setRequired
    if(this.selectableItem.editableConfig.setRequired){
      this.form.addControl(
        'required',
        new FormControl(this.fieldItem.required, [])
      );
    }
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
    // help
    if(this.selectableItem.editableConfig.setHelp){
      this.form.addControl(
        'help',
        new FormControl(this.fieldItem.help, [])
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
