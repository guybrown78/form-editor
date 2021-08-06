import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../../form-editor-config.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'form-tab-items',
  templateUrl: './tab-items.component.html',
  styleUrls: ['./tab-items.component.css']
})
export class TabItemsComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<FieldItemModel[]>()
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
    this.formReady = false;
    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){

        if(item.fieldGroup){
          this.tabItems = item.fieldGroup;
        }else{
          this.tabItems = []
        }

        this.selectableItem = selectableItem;
        this._fieldItem = item;
      }
    })
  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }

  private _tabItems: FieldItemModel[] = [];
  set tabItems(values:FieldItemModel[]){
    if(values){
      this._tabItems = [ ...values ]
    }
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
    // this.form = this.fb.group({});

    const tabs = [];
    this._tabItems.map((tab, i) => {
      tabs.push(this.createTabFormGroup(tab));
    })
    this.form = this.fb.group({
      fieldGroup: this.fb.array([ ...tabs ])
    });
    this.onChanges();
    this.formReady = true;
  }

  createTabFormGroup(item:FieldItemModel){
    const fg:FormGroup = this.fb.group({
      label: item.label,
      key: item.key,
      type: item.type,
      uuid: item.uuid,
      fieldGroup: item.fieldGroup
    });
    return fg;
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      // this.updated.emit(this.form.value.fieldGroup)
      this.updatedFieldGroup.emit(this.form.value.fieldGroup);
    });
  }


  // onSelectItemChange(value: string): void {
  //   this.add(value);
  // }


  addItem(label:string = null) {

    this.formEditorConfig.getSelectableItemFromId('tab').pipe(take(1)).subscribe(item => {

      item.label = label
      const fieldGroup = this.form.get('fieldGroup') as FormArray;
      fieldGroup.push(this.createTabFormGroup(item));

      // this.selectedField.emit(item);
    })

    // this.add('tab');


  }

  removeItem(index:number) {
    const options = this.form.get('fieldGroup') as FormArray;
    options.removeAt(index);
  }

  // add(id): void {
  //   this.formEditorConfig.getSelectableItemFromId(id).pipe(take(1)).subscribe(item => {

  //     item
  //     const formGroup = this.form.get('fieldGroup') as FormArray;
  //     formGroup.push(this.createTabFormGroup(item))

  //     this.selectedField.emit(item);
  //   })

  // }

}
