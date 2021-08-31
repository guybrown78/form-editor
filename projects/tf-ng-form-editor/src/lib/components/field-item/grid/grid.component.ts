import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FieldItemModel, SelectableWrapper } from '../../../to-share/field-item-model.interface';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  SelectableCategory
} from '../../../form-editor-config.service';
import { last, take } from 'rxjs/operators';
import {
  FieldItemGridOptionsColumnDefsModel,
  FieldItemGridOptionsModel
} from '../../../to-share/field-item-component-options-model.interface';
import { TfNgFormEditorService } from '../../../tf-ng-form-editor.service';
import { RowUpdateModel } from './row/row.component';



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

          //

          // console.log("...going")
          // // TODO - put this somewhere nicer
          // if(this.fieldItem.fieldGroup){
          //   console.log(this.fieldItem.fieldGroup.length, this.columnDefs.length);
          //   if(this.fieldItem.fieldGroup.length > this.columnDefs.length){
          //     console.log('change');
          // //     // remove the unwanted items
          // //     const unwanted =  this.fieldItem.fieldGroup.splice(this.columnDefs.length, this.fieldItem.fieldGroup.length);
          //   }
          // }

          this.initForm();
          // this.initRowForm();
          // set changes
          setTimeout(() => {

            // TODO -
            // this.updatedFieldGroup.emit(this.rowForm.value)
            this.onChanges();
            this.formReady = true;
          },10);
          //
        }else{
          this._fieldItem = item;
        }
      }
    }, err => {
      // console.log("err")
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }


  form: FormGroup;
  // rowForm:FormArray;

  columnDefs:FieldItemGridOptionsColumnDefsModel[];
  types: SelectableFieldItemModel[];
  formReady:boolean = false;
  colDefaultsSpans

  // wrappersFormArray:FormArray = new FormArray([]);

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService
  )
  {
    // TODO - get this from the formPreviewLib
    this.colDefaultsSpans = formEditorConfig._columnDefinitions.map(c => c.columnWidths.filter(cw => cw.default)[0].widths
    )
    // this.wrappersFormArray.push(new FormControl(SelectableWrapper.GRID_CELL_FIELD));
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

    // initialise a form for the header (componentOptions)
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
  }

  // initRowForm(){
  //   // initialise a form for the rows (fieldGroup)
  //   const rows = [];
  //   if(this.fieldItem.fieldGroup){
  //     this.fieldItem.fieldGroup.map((row, i) => {
  //       rows.push(this.createGridFormRow(i, row));
  //     })
  //   }
  //   this.rowForm = this.fb.array([ ...rows]);
  // }

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
      // this.initRowForm();
    });

    // this.rowForm.valueChanges.subscribe((val) => {
    //   this.updatedFieldGroup.emit(this.rowForm.value)
    // });

  }

  addRow(){
    // const rows = this.rowForm as FormArray;
    console.log(this.fieldItem.fieldGroup?.length);
    //
    const lastRow:FieldItemModel = this.fieldItem.fieldGroup?.length > 0 ? this.fieldItem.fieldGroup[this.fieldItem.fieldGroup?.length - 1] : null
    // if(this.fieldItem.fieldGroup?.length > 0){
    //   const row:FieldItemModel = { ...this.fieldItem.fieldGroup[this.fieldItem.fieldGroup?.length - 1] }
    //   row.key = `row-${this.fieldItem.fieldGroup?.length}`;
    //   this.formEditorService.addFormItemToFieldGroup(this.fieldItem, row);
    // }else{
      this.formEditorConfig.getSelectableItemFromType("grid-row").subscribe(
        selectable => {
          if(selectable){
            const row:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectable);
            row.key = `row-${this.fieldItem.fieldGroup?.length || 0}`;
            //
            row.fieldGroup = []

            this.formEditorConfig.getSelectableItemFromType("empty-grid-cell").subscribe(emptyCel => {
              let cel:FieldItemModel = this.formEditorService.getFieldItemFromSelection(emptyCel);
              cel.label = "";
              cel.wrappers = [SelectableWrapper.GRID_CELL_FIELD]
              this.columnDefs.map((col, i) => {
                cel.key = col.field;
                if(!lastRow){
                  row.fieldGroup.push({ ...cel });
                }else{
                  const currCel:FieldItemModel = { ...lastRow.fieldGroup[i] };
                  row.fieldGroup.push({
                    ...currCel,
                    uuid:this.formEditorService.getUuid()
                  });
                }

              })
              this.formEditorService.addFormItemToFieldGroup(this.fieldItem, row);

            });


          }
        }
      )
    // }


  }

  // removeRow(index:number){
  //   const rows = this.rowForm as FormArray;
  //   rows.removeAt(index);
  //   // this.formEditorService.deleteFormItem(this.fieldItem.uuid)
  // }
  onRowUpdated(row:RowUpdateModel){
    this.fieldItem.fieldGroup[row.index] = {
      ...this.fieldItem.fieldGroup[row.index],
      ...row.fieldItem
    }
    this.updatedFieldGroup.emit(this.fieldItem.fieldGroup);
  }

  // createGridFormRow(index:number, model:FieldItemModel){
  //   let cels = [];
  //   //const existingFieldGroup:FieldItemModel[] = model.fieldGroup.splice(0, this.columnDefs.length - 1);
  //   if(model.fieldGroup){

  //   }

  //   //
  //   this.columnDefs.map((item, i) => {

  //     let fg:FormGroup = this.fb.group({})

  //     if(model.fieldGroup){
  //       if(model.fieldGroup.length > this.columnDefs.length){
  //         // remove the unwanted items
  //         const unwanted =  model.fieldGroup.splice(this.columnDefs.length, model.fieldGroup.length);
  //       }
  //       if(model.fieldGroup[i]){
  //         fg.addControl('type', new FormControl(model.fieldGroup[i].type));
  //         fg.addControl('key', new FormControl(model.fieldGroup[i].key));
  //       }else{
  //         fg.addControl('type', new FormControl(null));
  //         fg.addControl('key', new FormControl(this.columnDefs[i].field));
  //       }
  //     }else{
  //       fg.addControl('type', new FormControl(null));
  //       fg.addControl('key', new FormControl(this.columnDefs[i].field));
  //     }
  //     // add the [grid-cell-field] wrappers as standard (won't render the grid in preview properly without!)
  //     fg.addControl('wrappers', this.wrappersFormArray)
  //     cels.push(fg)

  //   })

  //   const fg:FormGroup = this.fb.group({
  //     type: model?.type,
  //     key: model?.key,
  //     fieldGroup:this.fb.array([ ...cels ])
  //   });
  //   return fg;
  // }

  // onRowCelFieldItem(fieldItem:FieldItemModel, rowIndex:number, colIndex:number){
    // console.log(fieldItem.type, rowIndex, colIndex)
    // console.log(fieldItem)
    // const rowFG:FormGroup = this.rowForm.at(rowIndex) as FormGroup
    // console.log(rowFG)
    // console.log(typeof(rowFG));
    // const rowFieldGroup:FormArray = rowFG.controls['fieldGroup'] as FormArray
    // const colFG:FormGroup = rowFieldGroup.at(colIndex) as FormGroup
    // console.log(colFG.value)
    // colFG.setValue({
    //   type:fieldItem.type,
    //   key:colFG.controls['key'].value,
    //   wrappers:'[grid-cell-field]',
    //   uuid:fieldItem.uuid
    // });
    // console.log(colFG.value)
  // }



  // TODO - get this from the formPreviewLib
  getColSpan(col: any, index:number){
    const total = this.columnDefs.length
    if(col.width){
      return Math.round(col.width || 24 / total);
    }
    return this.colDefaultsSpans[total-1][index];
  }
}
