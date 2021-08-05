import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  EditorItemModel
} from '../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';


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

  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder
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
    // setPermissions
    if(this.selectableItem.editableConfig.setPermissions){
      this.form.addControl(
        'permissions',
        new FormControl(this.fieldItem.permissions, [])
      );
    }
    // setReadonlyPermissions
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

}
