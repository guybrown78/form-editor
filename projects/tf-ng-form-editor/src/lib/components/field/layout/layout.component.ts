import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  EditorItemModel
} from '../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';
import { FieldItemComponentOptionsModel } from '../../../to-share/field-item-component-options-model.interface';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';


@Component({
  selector: 'field-item-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

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

  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {}

  initForm(): void {
    this.form = this.fb.group({});

    if(this.selectableItem.editableConfig.hasLayoutOptions){
      this.form.addControl(
        'layout',
        new FormControl(this.fieldItem, [])
      );
    }
    if(this.showDetailsComponentOptions()){
      this.form.addControl('componentOptions', new FormControl(this.fieldItem.componentOptions, []))
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
      this.selectableItem.editableConfig.hasLayoutOptions ||
      this.selectableItem.editableConfig.hasGridOptions
    ){
      show = true;
    }
    return show
  }

}
