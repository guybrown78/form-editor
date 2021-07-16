import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel } from '../../../form-editor-config.service';
import { OptionModel, FieldItemComponentOptionsModel } from '../../../to-share/field-item-component-options-model.interface'
import { FieldItemModel } from '../../../to-share/field-item-model.interface';
import { FieldItemLayoutOption } from '../../../to-share/field-item-component-options-model.interface';
import { take } from 'rxjs/operators';
@Component({
  selector: 'field-details-component-options',
  templateUrl: './component-options.component.html',
  styleUrls: ['./component-options.component.css']
})
export class ComponentOptionsComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemComponentOptionsModel>()

  private _selectableItem:SelectableFieldItemModel
  set selectableItem(model:SelectableFieldItemModel){
    this.optionsName = model.editableConfigOptionsName || null;
    this._selectableItem = model;
  }
  get selectableItem():SelectableFieldItemModel{
    return this._selectableItem;
  }

  private _fieldItem:FieldItemModel
  @Input('fieldItem') set fieldItem(item:FieldItemModel){
    this.formReady = false;
    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){
        this.selectableItem = selectableItem;
        this._fieldItem = item;
        this.initForm();
      }
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }

  form: FormGroup;
  optionsName: string;
  formReady:boolean = false;

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService
  ) {}

  ngOnInit() {
    // this.initForm();
    // this.onChanges();
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
    this.onChanges();
    this.formReady = true;
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
    if(optionsName){
      if(!this.fieldItem.componentOptions || !this.fieldItem.componentOptions[optionsName]){
        return null;
      }
    }
    return !this.fieldItem.componentOptions ? null : optionsName ? this.fieldItem.componentOptions[optionsName][key] : this.fieldItem.componentOptions[key];
  }

}
