import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel } from '../../form-editor-config.service';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemComponentOptionsModel, OptionModel } from '../../to-share/field-item-component-options-model.interface';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

@Component({
  selector: 'form-editor-field-item',
  templateUrl: './field-item.component.html',
  styleUrls: ['./field-item.component.css']
})
export class FieldItemComponent implements OnInit {

  private _key:string;
  @Input('key') set key(value:string){
    this._key = value;
    this.initialiseFormSubscription()
  }
  get key():string{
    return this._key;
  }

  // selectedKeySubscription:Subscription
  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  form: FormGroup;
  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    // this.initialiseFormSubscription()
  }

  initialiseFormSubscription(){
    if(this.key){
      this.formEditorService.getFieldItemFromTreeKey(this.key).subscribe(
        item => {
          if(item){
            this.fieldItem = item;
            if(!this.selectableItem){
              this.initialiseItemConfigData()
            }
          }
        }
      )
    }else{
      this.fieldItem = null;
      this.selectableItem = null;
    }
  }


  initialiseItemConfigData(){
     // when item has been inited get config data from 'type'...
     this.formEditorConfig.getSelectableItemFromType(this.fieldItem.type).pipe(take(1)).subscribe(selectableItem => {

      if(selectableItem){
        this.selectableItem = { ...selectableItem};
        this.initForm();
      }else{
        this.selectableItem = null;
      }
    })
  }

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
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = { ...this.fieldItem, ...this.form.value}
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }


  onOptionsUpdated(options:OptionModel[]){
    const componentOptions:FieldItemComponentOptionsModel = {
      ...this.fieldItem.componentOptions,
      options
    }
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

  destroy(){
    // this.selectedKeySubscription.unsubscribe
  }

}
