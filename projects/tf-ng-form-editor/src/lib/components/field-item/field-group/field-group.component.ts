import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../../form-editor-config.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'form-item-field-group',
  templateUrl: './field-group.component.html',
  styleUrls: ['./field-group.component.css']
})
export class FieldGroupComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemModel[]>()
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
    this.formReady = false;
    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){
        this.selectableItem = selectableItem;
        this._fieldItem = item;
        // this.initForm();
      }
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }


  form: FormGroup;
  types: SelectableFieldItemModel[];
  formReady:boolean = false;

  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService
  ) {}

  ngOnInit() {
    this.initAvailableItems();
  }

  initAvailableItems(){
    this.formEditorConfig.selectableItems.pipe(take(1)).subscribe(
      types => {
        if(types){
          this.types = [ ...types.filter(t => t.category === SelectableCategory.SIMPLE)];
          this.initForm();
          this.onChanges();
        }else{
          this.types = [];
        }
      }
    )
  }

  initForm(){
    this.form = this.fb.group({});
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.updated.emit(this.form.value.options)
    });
  }


  onSelectItemChange(value: string): void {
    this.add(value);
  }

  add(id): void {
    console.log(id);
    this.formEditorConfig.getSelectableItemFromId(id).pipe(take(1)).subscribe(item => {
      this.selectedField.emit(item);
    })

  }

}
