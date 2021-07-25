import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from 'projects/tf-ng-form-editor/src/lib/form-editor-config.service';
import { TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/lib/tf-ng-form-editor.service';
import { FieldItemModel } from 'projects/tf-ng-form-editor/src/lib/to-share/field-item-model.interface';
import { take } from 'rxjs/operators';

import {
  FieldItemComponentOptionsModel,
  OptionModel,
  FieldItemGridOptionsModel
} from '../../../../to-share/field-item-component-options-model.interface';

@Component({
  selector: 'form-editor-cell-field-item',
  templateUrl: './cell-field-item.component.html',
  styleUrls: ['./cell-field-item.component.css']
})
export class CellFieldItemComponent implements OnInit {


   // accept FieldItem
   private _selectableItem:SelectableFieldItemModel
   set selectableItem(model:SelectableFieldItemModel){
     this._selectableItem = model;
   }
   get selectableItem():SelectableFieldItemModel{
     return this._selectableItem;
   }

  private _fieldItem:FieldItemModel
  @Input('fieldItem') set fieldItem(item:FieldItemModel){

    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){
        this.selectableItem = selectableItem;
        //
        this._fieldItem = item;
        this.initForm();
        this.onChanges();
        this.formReady = true;
        //
      }
    }, err => {
      console.log("err")
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }


  form: FormGroup;
  formReady:boolean = false;


  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService,
  ) { }

  ngOnInit(): void {
  }

  initForm(){
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
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
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

  updateComponentOptions(componentOptions:FieldItemComponentOptionsModel){
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }

}
