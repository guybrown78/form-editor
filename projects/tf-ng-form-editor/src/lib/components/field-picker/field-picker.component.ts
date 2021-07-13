import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';

@Component({
  selector: 'form-editor-field-picker',
  templateUrl: './field-picker.component.html',
  styleUrls: ['./field-picker.component.css']
})
export class FieldPickerComponent {

  types: SelectableFieldItemModel[]

  // @Output('selected') selected = new EventEmitter<boolean>();
  @Output('selectedField') selectedField = new EventEmitter<any>();

  private _category:SelectableCategory = SelectableCategory.SIMPLE;
  @Input('category') set category(value:SelectableCategory){
    this._category = value;
    this.setTypes();
  }
  get category():SelectableCategory{
    return this._category
  }

  constructor(
    private formEditorConfig:FormEditorConfigService
  ) {

  }

  setTypes(){
    this.formEditorConfig.selectableItems.pipe(take(1)).subscribe(types => {
      if(types){
        this.types = [ ...types.filter(t => t.category === this.category)]
      }else {
        this.types = []
      }
    })
  }

  add(id): void {
    this.formEditorConfig.getSelectableItemFromId(id).pipe(take(1)).subscribe(item => {
      this.selectedField.emit(item);
    })

  }

}
