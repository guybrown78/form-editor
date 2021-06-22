import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, throwError, Observable } from 'rxjs';
import { take, tap, } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormModel } from './to-share/form-model.interface';
import { FieldItemModel } from './to-share/field-item-model.interface';
import { FormEditorConfigService, SelectableFieldItemModel } from './form-editor-config.service';
import { v4 as uuidv4 } from 'uuid';
import { FormMetaModel } from './to-share/form-meta-model.interface';

@Injectable({
  providedIn: 'root'
})
export class TfNgFormEditorService {

  // Observable sources
  private _form = new BehaviorSubject<FormModel>(null);

  // Observable stream
  form = this._form.asObservable();

  constructor(
    private formEditorConfig:FormEditorConfigService
  ) { }

  addFormItem(item:FieldItemModel, ordinum:number | null = null){
    this.form.pipe(take(1)).subscribe(form => {
      const updatedForm:FormModel = { ...form }
      updatedForm.schema.push(item);
      this._form.next(updatedForm);
    })
  }

  getFieldItemFromSelection(selectedField:SelectableFieldItemModel):FieldItemModel{
    const fieldItem:FieldItemModel = {}
    fieldItem.uuid = uuidv4();
    fieldItem.label = "Name";
    fieldItem.type = "input";
    return fieldItem;
  }

  initialiseNewForm(meta:FormMetaModel){
    this.nullifyForm().subscribe(success => {
      this._form.next({
        meta,
        schema: [],
        model: {}
      });
    })
  }

  nullifyForm():Observable<boolean>{
    this._form.next(null)
    return of(true);
  }

  getFormDataAsJSON(){
    this.form.pipe(take(1)).subscribe(form => {
      return JSON.stringify(form);
    })
  }
}
