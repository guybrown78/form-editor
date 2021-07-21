import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';
import {
  FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../../form-editor-config.service';
import { take } from 'rxjs/operators';
import { FieldItemGridOptionsColumnDefsModel, FieldItemGridOptionsModel } from '../../../to-share/field-item-component-options-model.interface';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';



@Component({
  selector: 'form-item-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemGridOptionsModel>()
  @Output('updatedFieldGroup') updatedFieldGroup = new EventEmitter<FieldItemModel[]>()

  @Output('selectedField') selectedField = new EventEmitter<SelectableFieldItemModel>()

  private _selectableItem:SelectableFieldItemModel
  set selectableItem(model:SelectableFieldItemModel){
    this._selectableItem = model;
  }
  get selectableItem():SelectableFieldItemModel{
    return this._selectableItem;
  }

  // @Input('fieldItem') fieldItem:FieldItemModel
  private _fieldItem:FieldItemModel
  @Input('fieldItem') set fieldItem(item:FieldItemModel){

    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){

        const a:string = JSON.stringify(item.componentOptions?.gridOptions?.columnWidths) || "";
        const b:string = this.fieldItem ? JSON.stringify(this.fieldItem.componentOptions?.gridOptions?.columnWidths) : null;

        if(!this.fieldItem || a !== b){

          this.selectableItem = selectableItem;
          this.columnDefs = item.componentOptions?.gridOptions?.columnDefs || [];
          this._fieldItem = item;
          this.initForm();
        }else{
          this._fieldItem = item;
        }
      }
    }, err => {
      console.log("err")
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }


  form: FormGroup;
  rowForm:FormArray;

  columnDefs:FieldItemGridOptionsColumnDefsModel[];
  types: SelectableFieldItemModel[];
  formReady:boolean = false;
  colDefaultsSpans

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService
  )
  {
    this.colDefaultsSpans = formEditorConfig._columnDefinitions.map(c => c.columnWidths.filter(cw => cw.default)[0].widths
    )
  }

  ngOnInit() {
    this.initAvailableItems();
  }

  initAvailableItems(){
    this.formEditorConfig.selectableItems.pipe(take(1)).subscribe(
      types => {
        if(types){
          this.types = [ ...types.filter(t => t.category === SelectableCategory.SIMPLE)];
        }else{
          this.types = [];
        }
      }
    )
  }

  initForm(){


    const defs = [];
    this.columnDefs.map((item, i) => {
      defs.push(this.createColumnDefFormGroup(item, i));
    })
    this.form = this.fb.group({
      columnCount: this.fb.control(this.columnDefs.length, []),
      columnWidths: this.fb.control(this.columnDefs.map(w => w.width)),
      columnDefs: this.fb.array([ ...defs ])
    });
    // console.log(this.form.value.columnDefs);

    const rows = [];
    if(this.fieldItem.fieldGroup){
      this.fieldItem.fieldGroup.map((row, i) => {
        rows.push(this.createGridFormRow(i, row));
      })
    }
    this.rowForm = this.fb.array([ ...rows]);


    this.onChanges();
    this.formReady = true;
  }

  createColumnDefFormGroup(item, index){
    const fg:FormGroup = this.fb.group({
      headerName: item.headerName || null,
      field: item.field || `col-${index + 1}`,
      width: item.width
    });
    return fg;
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.updated.emit(this.form.value)
    });

    this.rowForm.valueChanges.subscribe((val) => {
      this.updatedFieldGroup.emit(this.rowForm.value)
    });

  }

  addRow(){
    const rows = this.rowForm as FormArray;

    this.formEditorConfig.getSelectableItemFromType("grid-row").subscribe(
      selectable => {
        if(selectable){
          const row:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectable);
          row.key = `row-${rows.length}`,
          rows.push(this.createGridFormRow(rows.length, row));
        }
      }
    )

  }

  removeRow(index:number){
    const rows = this.rowForm as FormArray;
    rows.removeAt(index);
  }

  createGridFormRow(index:number, model:FieldItemModel){
    const fg:FormGroup = this.fb.group({
      type: model?.type,
      key: model?.key,
      fieldGroup:null
    });
    return fg;
  }

  getColSpan(col: any, index:number){
    const total = this.columnDefs.length
    if(col.width){
      return Math.round(col.width || 24 / total);
    }
    return this.colDefaultsSpans[total-1][index];
  }

}
