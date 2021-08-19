import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { FieldItemComponentOptionsModel } from '../../../to-share/field-item-component-options-model.interface';

@Component({
  selector: 'field-item-config-options',
  templateUrl: './config-options.component.html',
  styleUrls: ['./config-options.component.css']
})
export class ConfigOptionsComponent implements OnInit {

  @Output("updatedFieldItem") updatedFieldItem = new EventEmitter<FieldItemModel>();

  private _editorItemModel:EditorItemModel
  @Input('editorItemModel') set editorItemModel(item:EditorItemModel){
    if(item.fieldItem.uuid !== this.fieldItem?.uuid){
      this.formReady = false;
      this.selectableItem = item.selectableItem;
      this.fieldItem = item.fieldItem;
      this.initForm();
    }
  }
  get editorItemModel():EditorItemModel{
    return this._editorItemModel
  }

  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  form: FormGroup;
  formReady:boolean = false;

  // // permissions
  // availablePermissions:any[];
  // selectedPermissions:number[];

  // // read only
  // availableReadOnlyPermissions:any[];
  // selectedReadOnlyPermissions:number[];


  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder,
    private formPermissionService:TfNgFormPermissionService
  ) { }

  ngOnInit(): void {}


  initForm(): void {
    this.form = this.fb.group({});
    // setRequired
    if(this.selectableItem.editableConfig.setRequired){
      this.form.addControl(
        'required',
        new FormControl(this.fieldItem.required, [])
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

  onComponentOptionsUpdated(cmpOptions:FieldItemComponentOptionsModel){
    const componentOptions:FieldItemComponentOptionsModel = {
      ...this.fieldItem.componentOptions,
      ...cmpOptions
    }
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem);
    this.updatedFieldItem.emit(this.fieldItem)
  }

  showDetailsComponentOptions():boolean{

    let show:boolean = false;
    if(!this.selectableItem){
      return show;
    }
    if(
      this.selectableItem.editableConfig.hasDateOptions
    ){
      show = true;
    }
    console.log(this.selectableItem.editableConfig.hasDateOptions, show)
    return show
  }

}
