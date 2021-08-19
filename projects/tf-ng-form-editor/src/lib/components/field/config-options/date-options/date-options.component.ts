import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
} from '../../../../form-editor-config.service';
import {
  OptionModel,
  FieldItemComponentOptionsModel,
  FieldItemGridOptionsColumnDefsModel,
  FieldItemDateOptionsModel,
  FieldItemDateModeOption
} from '../../../../to-share/field-item-component-options-model.interface'

import { FieldItemModel } from '../../../../to-share/field-item-model.interface';

import { take } from 'rxjs/operators';
@Component({
  selector: 'form-item-date-options',
  templateUrl: './date-options.component.html',
  styleUrls: ['./date-options.component.css']
})
export class DateOptionsComponent implements OnInit {

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
  availableDateModes:any[] = [
    {label:"Default", value:FieldItemDateModeOption.DEFAULT},
    {label:"Week", value:FieldItemDateModeOption.WEEK},
    {label:"Month", value:FieldItemDateModeOption.MONTH},
    {label:"Year", value:FieldItemDateModeOption.YEAR}
  ]
  selectedMode:any;

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService
  ) {}

  ngOnInit(): void {
  }

  initForm(){

    this.form = this.fb.group({});
    // hasDataOptions
    if(this.selectableItem.editableConfig.hasDateOptions){
      this.form.addControl(
        'mode',
        new FormControl(this.getComponentOptionData('mode', this.optionsName), [])
      );
      this.form.addControl(
        'format',
        new FormControl(this.getComponentOptionData('format', this.optionsName), [])
      );
    }
    // hasColumn
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

  getComponentOptionData(key, optionsName, defaultValue = null){
    if(optionsName){
      if(!this.fieldItem.componentOptions || !this.fieldItem.componentOptions[optionsName]){
        return null;
      }
    }
    return !this.fieldItem.componentOptions ? null : optionsName ? this.fieldItem.componentOptions[optionsName][key] | defaultValue : this.fieldItem.componentOptions[key] | defaultValue;
  }

  onModeChange(value){
    this.form.controls['mode'].setValue(value);
  }
}
