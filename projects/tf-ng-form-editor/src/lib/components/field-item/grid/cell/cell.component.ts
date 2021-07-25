import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from 'projects/tf-ng-form-editor/src/lib/form-editor-config.service';
import { TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/lib/tf-ng-form-editor.service';
import { FieldItemGridOptionsColumnDefsModel } from 'projects/tf-ng-form-editor/src/lib/to-share/field-item-component-options-model.interface';
import { FieldItemModel, SelectableWrapper } from 'projects/tf-ng-form-editor/src/lib/to-share/field-item-model.interface';
import { take } from 'rxjs/operators';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CellFieldItemComponent } from '../cell-field-item/cell-field-item.component'

@Component({
  selector: 'form-grid-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemModel>()

  @Input('parentFieldItem') parentFieldItem:FieldItemModel;
  @Input('parentKey') parentKey:string;
  @Input('index') index:number;
  @Input('columnDef') columnDef:FieldItemGridOptionsColumnDefsModel;

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
        this.toSelect = item.type ? false : true;
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
  toSelect:boolean = true;
  types: SelectableFieldItemModel[];

  // set form on fieldItem
  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService,
    private modal:NzModalService
  ){}

  ngOnInit(): void {
    this.initAvailableItems();
    this.initForm();
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
    this.form = this.fb.group({});
    this.form.addControl('type', new FormControl(this.fieldItem?.type || null));
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.updated.emit(this.form.value)
    });
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
        //
        fieldItem.label = "";
        fieldItem.key = this.columnDef.field
        fieldItem.wrappers = [SelectableWrapper.GRID_CELL_FIELD]
        // 3. add it
        this.formEditorService.addFormItemToFieldGroup(this.parentFieldItem, fieldItem, this.index)

      }

    })

  }

  onCellFieldEdit(){
    this.showFieldItemModal();
  }

  showFieldItemModal(title:string = "Edit Field Item"){
    const style = {
      maxHeight:'800px',
      overflow:'auto'
    }
    const modalEL: NzModalRef = this.modal.create({
      nzTitle: title,
      nzContent:CellFieldItemComponent,
      nzComponentParams: {
        fieldItem:this.fieldItem
      },
      nzBodyStyle:style,
      // nzFooter: [
        // {
        //   label: 'Cancel',
        //   type: 'dashed',
        //   loading: false,
        //   onClick(): void {
        //     console.log("cancel")
        //     // this.loading = true;
        //     // var dummy = document.createElement("textarea");
        //     // document.body.appendChild(dummy);
        //     // dummy.value = data;
        //     // dummy.select();
        //     // document.execCommand("copy");
        //     // document.body.removeChild(dummy);
        //     // this.label = 'copying JSON';
        //     // setTimeout(() => {
        //     //   this.loading = false;
        //     //   this.disabled = true;
        //     //   this.label = 'copied to clipboard';
        //     // }, 1000);
        //   }
        // },
        // {
        //   label: 'Done',
        //   type: 'primary',
        //   onClick(): void {
        //    modalEL.close();
        //   }
        // }
      // ]
    });
  }
}
