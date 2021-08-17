import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  EditorItemModel,
  EditableConfigType
} from '../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';
import {
  FieldItemComponentOptionsModel,
  FieldItemGridOptionsModel,
  OptionModel
} from '../../../to-share/field-item-component-options-model.interface';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';


@Component({
  selector: 'field-item-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  private _editorItemModel:EditorItemModel
  @Input('editorItemModel') set editorItemModel(item:EditorItemModel){
    // if(item.fieldItem.uuid !== this.fieldItem?.uuid){
      this.formReady = false;
      this.selectableItem = item.selectableItem;
      this.fieldItem = item.fieldItem;
      this.initForm();
    // }
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

    // label
    if(this.selectableItem.editableConfig.setLabel){
      this.form.addControl('label', new FormControl(this.fieldItem.label, []))
    }
    // description
    if(this.selectableItem.editableConfig.setDesc){
      this.form.addControl('description', new FormControl(this.fieldItem.description, []))
    }
    // placeholder
    if(this.selectableItem.editableConfig.setPlaceholder){
      this.form.addControl('placeholder', new FormControl(this.fieldItem.placeholder, []))
    }
    // hasComponentOptions
    if(this.selectableItem.editableConfig.hasComponentOptions){
      this.form.addControl('componentOptions', new FormControl(this.fieldItem.componentOptions, []))
    }
    // hasFieldGroup
    if(this.selectableItem.editableConfig.hasFieldGroup){
      this.form.addControl('fieldGroup', new FormControl(this.fieldItem.fieldGroup, []))
    }


    this.onChanges();
    this.formReady = true;
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = {
        ...this.fieldItem,
        ...this.form.value
      }
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }


  onOptionsUpdated(options:OptionModel[]){
    this.updateComponentOptions({
      ...this.fieldItem.componentOptions,
      options
    })
  }
  onGridOptionsUpdated(gridOptions:FieldItemGridOptionsModel){
    this.updateComponentOptions({
      ...this.fieldItem.componentOptions,
      gridOptions
    })
  }
  updateComponentOptions(componentOptions:FieldItemComponentOptionsModel){
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }


  addFieldGroupItem(selectedField:SelectableFieldItemModel){
    const formFieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectedField)
    this.formEditorService.addFormItemToFieldGroup(this.fieldItem, formFieldItem);
  }

  onFieldGroupUpdated(fieldGroup:FieldItemModel[]){
    this.fieldItem = {
      ...this.fieldItem,
      fieldGroup
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }

  addFieldGridItem(selectedField:SelectableFieldItemModel){
    const formFieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectedField)
  }

  hasFieldGroup(){
    if(this.selectableItem.editableConfig.hasFieldGroup){
      return this.selectableItem.editableConfig.type !== EditableConfigType.TABS
    }
    return false;
  }

  hasTabs(){
    return this.selectableItem.editableConfig.type === EditableConfigType.TABS
  }

  onRichTextUpdated(value:string){
    this.form.controls['description'].setValue(value)
  }
}
