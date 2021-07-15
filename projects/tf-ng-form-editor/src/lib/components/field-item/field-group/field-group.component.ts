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
  @Input('selectableItem') set selectableItem(model:SelectableFieldItemModel){
    this._selectableItem = model;
  }
  get selectableItem():SelectableFieldItemModel{
    return this._selectableItem;
  }

  @Input('fieldItem') fieldItem:FieldItemModel


  form: FormGroup;
  types: SelectableFieldItemModel[];

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
    this.formEditorConfig.getSelectableItemFromId(id).pipe(take(1)).subscribe(item => {
      this.selectedField.emit(item);
    })

  }

}
