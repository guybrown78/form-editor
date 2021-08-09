import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormEditorConfigService, SelectableCategory, SelectableFieldItemModel } from '../../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../../../to-share/field-item-model.interface';
import { take } from 'rxjs/operators';


@Component({
  selector: 'form-item-grid-cell-formgroup',
  templateUrl: './cell-formgroup.component.html',
  styleUrls: ['./cell-formgroup.component.css']
})
export class CellFormgroupComponent implements OnInit {

  private _formGroup:FormGroup;
  @Input('formGroup') set formGroup(fg:FormGroup){
    if(!fg.controls['type'].value){
      this.toSelect = true;
    }
    this._formGroup = fg;
  }
  get formGroup():FormGroup{
    return this._formGroup;
  }


  // @Input('colIndex') colIndex:number;
  // @Input('rowIndex') rowIndex:number;


  @Output('selectedField') selectedField = new EventEmitter<SelectableFieldItemModel>()

  @Output('fieldItem') fieldItem = new EventEmitter<FieldItemModel>()


  toSelect:boolean = false;
  types: SelectableFieldItemModel[];

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
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


  onSelectItemChange(value: string): void {
    this.add(value);
  }


  add(id): void {
    // 1. get the selectable item
    this.formEditorConfig.getSelectableItemFromId(id).pipe(take(1)).subscribe(item => {
      if(item){
        // 2. get fieldItem
        const fieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(item);
        // fieldItem.key = this.formGroup.controls['key'].value;
        // fieldItem.wrappers = [this.formGroup.controls['wrappers'].value];
        //
        // this.fieldItem.emit(fieldItem)
        this.formGroup.controls['type'].setValue(fieldItem.type)
      }

    })

  }
}
