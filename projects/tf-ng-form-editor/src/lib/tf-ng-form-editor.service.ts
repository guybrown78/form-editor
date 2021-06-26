import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, throwError, Observable, Subscription } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormModel } from './to-share/form-model.interface';
import { FieldItemModel } from './to-share/field-item-model.interface';
import { FormEditorConfigService, SelectableFieldItemModel } from './form-editor-config.service';
import { v4 as uuidv4 } from 'uuid';
import { FormMetaModel } from './to-share/form-meta-model.interface';



export interface FormTreeModel {
  title:string
  key:string
  selected?:boolean
  children?:FormTreeModel[]
}

@Injectable({
  providedIn: 'root'
})
export class TfNgFormEditorService {
  formSubscription:Subscription


  // Observable sources
  private _form = new BehaviorSubject<FormModel>(null);
  private _formTree = new BehaviorSubject<FormTreeModel[]>(null);
  private _selectedTreeKey = new BehaviorSubject<string>(null);

  // Observable stream
  form = this._form.asObservable();
  formTree = this._formTree.asObservable();
  selectedTreeKey = this._selectedTreeKey.asObservable();

  constructor(
    private formEditorConfig:FormEditorConfigService
  ) {
    this.initialiseFormSubscription();
  }

  addFormItem(item:FieldItemModel, ordinum:number | null = null){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      updatedForm.schema.push(item);
      this.setSelectedTreeKey(item.uuid);
      this._form.next(updatedForm);
    })
  }

  getFieldItemFromTreeKey(key:string){
		return this._form.asObservable().pipe(map(form => {
			if(form){
        let matching:FieldItemModel = form.schema.filter(item => item.uuid === key)[0]
				return matching
			} else{
				return null;
			}
		}))
	}

  getFieldItemFromSelection(selectedField:SelectableFieldItemModel):FieldItemModel{
    const fieldItem:FieldItemModel = {}
    const uuid:string = uuidv4();
    fieldItem.uuid = fieldItem.key = uuid
    fieldItem.label = selectedField.label;
    fieldItem.type = selectedField.type;
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

  initialiseFormSubscription(){
    this.formSubscription = this.form.subscribe(form => {
      if(form){
        this.selectedTreeKey.pipe(take(1)).subscribe(key => {
          //
          this.parseFormToTree(form.schema, key).pipe(take(1)).subscribe(tree => {
            this._formTree.next([ ...tree ])
          })
          //
        })
      }
    })
  }

  parseFormToTree(schema:FieldItemModel[], currentSelectedKey:string):Observable<FormTreeModel[]>{
    let tree:FormTreeModel[];
    tree = schema.map(f => {
      return {
        key:f.uuid,
        title:f.label,
        selected:f.uuid === currentSelectedKey
      }
    })
    return of(tree);
  }

  setSelectedTreeKey(key:string){
    this._selectedTreeKey.next(key);
  }

  destroy(){
    this.formSubscription.unsubscribe
  }

}
