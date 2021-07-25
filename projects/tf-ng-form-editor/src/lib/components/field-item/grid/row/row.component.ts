import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Field } from '@ngx-formly/core';
import { FormEditorConfigService, SelectableFieldItemModel } from 'projects/tf-ng-form-editor/src/lib/form-editor-config.service';
import { TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/lib/tf-ng-form-editor.service';
import { FieldItemGridOptionsColumnDefsModel } from 'projects/tf-ng-form-editor/src/lib/to-share/field-item-component-options-model.interface';
import { FieldItemModel } from 'projects/tf-ng-form-editor/src/lib/to-share/field-item-model.interface';
import { take } from 'rxjs/operators';

export interface RowUpdateModel{
  fieldItem:FieldItemModel,
  index:number;
}
@Component({
  selector: 'form-grid-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<RowUpdateModel>()

  // accept FieldItem
  private _selectableItem:SelectableFieldItemModel
  set selectableItem(model:SelectableFieldItemModel){
    this._selectableItem = model;
  }
  get selectableItem():SelectableFieldItemModel{
    return this._selectableItem;
  }

  @Input('index') index:number;

  private _columnDefs:FieldItemGridOptionsColumnDefsModel[]
  @Input('columnDefs') set columnDefs(items:FieldItemGridOptionsColumnDefsModel[]){
    this._columnDefs = items;
  }
  get columnDefs():FieldItemGridOptionsColumnDefsModel[]{
    return this._columnDefs;
  }

  private _fieldItem:FieldItemModel
  @Input('fieldItem') set fieldItem(item:FieldItemModel){

    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){
        this.selectableItem = selectableItem;
        //
        if(!this.fieldItem){
          this.parentKey = item.uuid;
          this._fieldItem = item.fieldGroup[this.index];
          this.initForm();
          this.onChanges();
          this.formReady = true;
        }
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
  parentKey:string;
  colDefaultsSpans

  // set form on fieldItem
  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService
  ){
    // TODO - get this from the formPreviewLib
    this.colDefaultsSpans = formEditorConfig._columnDefinitions.map(c => c.columnWidths.filter(cw => cw.default)[0].widths
    )
  }

  ngOnInit(): void {
  }

  initForm(){
    this.form = this.fb.group({});
    this.form.addControl('key', new FormControl(this.fieldItem.key || null, {
      updateOn:'blur'
    }));
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.updated.emit({
        fieldItem:this.form.value,
        index:this.index
      })
    });
  }

  removeRow(){
    this.formEditorService.deleteFormItem(this.fieldItem.uuid, this.parentKey);
  }


  getCellFieldItem(index){
    let cellFieldGroup:FieldItemModel = {}
    if(this.fieldItem.fieldGroup){
      cellFieldGroup = this.fieldItem.fieldGroup[index] || {}
    }
    return cellFieldGroup
  }

  // TODO - get this from the formPreviewLib
  getColSpan(col: any, index:number){
    const total = this.columnDefs.length
    if(col.width){
      return Math.round(col.width || 24 / total);
    }
    return this.colDefaultsSpans[total-1][index];
  }


}


