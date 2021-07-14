import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { SelectableFieldItemModel } from '../../../form-editor-config.service';
import { OptionModel, FieldItemComponentOptionsModel } from '../../../to-share/field-item-component-options-model.interface'
import { FieldItemModel } from '../../../to-share/field-item-model.interface';
import { FieldItemLayoutOption } from '../../../to-share/field-item-component-options-model.interface';
@Component({
  selector: 'field-details-component-options',
  templateUrl: './component-options.component.html',
  styleUrls: ['./component-options.component.css']
})
export class ComponentOptionsComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemComponentOptionsModel>()

  private _selectableItem:SelectableFieldItemModel
  @Input('selectableItem') set selectableItem(model:SelectableFieldItemModel){
    this.optionsName = model.editableConfigOptionsName || null;
    this._selectableItem = model;
  }
  get selectableItem():SelectableFieldItemModel{
    return this._selectableItem;
  }

  @Input('fieldItem') fieldItem:FieldItemModel

  form: FormGroup;
  optionsName: string;

  constructor(
    private fb:FormBuilder
  ) {}

  ngOnInit() {
    this.initForm();
    this.onChanges();
  }

  initForm(){
    //
    this.form = this.fb.group({});
    // hasLayoutOptions
    if(this.selectableItem.editableConfig.hasLayoutOptions){
      this.form.addControl(
        'layout',
        new FormControl(this.getComponentOptionData('layout', this.optionsName), [])
      );
    }
    // hasShowBlocks
    if(this.selectableItem.editableConfig.hasShowBlocks){
      this.form.addControl(
        'showBlocks',
        new FormControl(this.getComponentOptionData('showBlocks', this.optionsName), [])
      );
    }
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      let model = {}
      if(this.optionsName){
        model[this.optionsName] = { ...this.form.value };
      }else{
        model = { ...this.form.value }
      }
      this.updated.emit(model)
    });
  }

  getComponentOptionData(key, optionsName){
    return !this.fieldItem.componentOptions ? null : optionsName ? this.fieldItem.componentOptions[optionsName][key] : this.fieldItem.componentOptions[key];
  }

}
