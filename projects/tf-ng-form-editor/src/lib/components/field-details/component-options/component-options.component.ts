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
  SelectableGridColumnDefinitions,
} from '../../../form-editor-config.service';
import {
  OptionModel,
  FieldItemComponentOptionsModel,
  FieldItemGridOptionsColumnDefsModel,
} from '../../../to-share/field-item-component-options-model.interface'

import { FieldItemModel } from '../../../to-share/field-item-model.interface';

import { take } from 'rxjs/operators';
@Component({
  selector: 'field-details-component-options',
  templateUrl: './component-options.component.html',
  styleUrls: ['./component-options.component.css']
})
export class ComponentOptionsComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemComponentOptionsModel>()
  @Output('nextStep') nextStep = new EventEmitter<boolean>()

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
  columnDefinitions:SelectableGridColumnDefinitions[];
  selectedColumnDefinition:SelectableGridColumnDefinitions;
  selectedColumnLayout:number[] ;

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService
  ) {
    this.columnDefinitions = formEditorConfig._columnDefinitions;
  }

  ngOnInit() {
    // this.initForm();
    // this.onChanges();
  }

  initForm(){
    //
    if(this.selectableItem.editableConfig.hasGridOptions){
      this.initialiseColumnDefinitions();
    }
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

    // hasColumn
    this.form.markAsPristine();
    this.onChanges();
    // setTimeout(() => {
      this.formReady = true;
    // }, 0);

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

  initialiseColumnDefinitions(){
    if(this.selectedColumnLayout){
      return
    }
    const columnDefs:FieldItemGridOptionsColumnDefsModel[] = this.getComponentOptionData('columnDefs', this.optionsName);
    if(columnDefs){
      const col:SelectableGridColumnDefinitions = this.columnDefinitions.filter(i => i.column === columnDefs.length)[0]
      this.selectedColumnDefinition = col;

      // TODO - the selectedColumnLayout = the correct value but somehow doesn't redraw. Maybe set the radio item into its own sub component and that has it's own lifecycle... or do a changeDetection hangeDetection: ChangeDetectionStrategy.OnPush similar to the form preview date-field ???????
      //
      setTimeout(() => {
        this.selectedColumnLayout = [ ...columnDefs.map(curr => {
          return curr.width;
        })];
      }, 50)

    }

  }

  onColumnDefinitionChange(columnDefinition:SelectableGridColumnDefinitions){

    this.selectedColumnDefinition = columnDefinition;
    this.onColumnLayoutChange(this.selectedColumnDefinition.columnWidths.filter(w => w.default)[0].widths)
  }

  onColumnLayoutChange(columnWidths:number[]){
    this.selectedColumnLayout = columnWidths;


    const currentColumnDefs:FieldItemGridOptionsColumnDefsModel[] = this.getComponentOptionData('columnDefs', this.optionsName);


    let columnDefs:FieldItemGridOptionsColumnDefsModel[] = columnWidths.map((w,i) => {
      const existing:FieldItemGridOptionsColumnDefsModel = !currentColumnDefs ? {} : currentColumnDefs[i] || {};
      return{
        ...existing,
        width:w
      }
    })
    let model = {}
    if(this.optionsName){
      model[this.optionsName] = {
        columnCount:this.selectedColumnLayout.length,
        columnWidths:this.selectedColumnLayout,
        columnDefs
      };
    }
    else{
      model = { ...columnDefs }
    }
    this.updated.emit(model)
  }

  onNextStep(){
    this.nextStep.emit(true)
  }
}
