import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  parentKey?:string
  selected?:boolean
  children?:FormTreeModel[]
  expanded?:boolean
  isLeaf?:boolean

}
export interface SaveFormModel {
  type:SaveTypeEnum
  data:string
}
export enum EditorModeEnum {
  EDIT = "edit",
  PREVIEW = "preview",
}
export enum SaveTypeEnum {
  DRAFT = "draft",
  PUBLISH = "publish",
}
export enum OrdinalDirectionEnum {
  UP,
  DOWN,
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
  private _editorMode = new BehaviorSubject<EditorModeEnum>(EditorModeEnum.EDIT);
  private _metaUpdated = new Subject<boolean>();
  private _formUpdated = new Subject<boolean>();
  private _save = new Subject<SaveFormModel>();
  private _close = new Subject<boolean>();

  // Observable stream
  form = this._form.asObservable();
  formTree = this._formTree.asObservable();
  selectedTreeKey = this._selectedTreeKey.asObservable();
  editorMode = this._editorMode.asObservable();
  metaUpdated = this._metaUpdated.asObservable();
  formUpdated = this._formUpdated.asObservable();
  save = this._save.asObservable();
  close = this._close.asObservable();

  constructor(
    private http: HttpClient,
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

  addFormItemToFieldGroup(parentItem:FieldItemModel, item:FieldItemModel, ordinum:number | null = null){

    if(!parentItem.fieldGroup){
      parentItem.fieldGroup = [];
    }
    parentItem.fieldGroup.push(item);

    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === parentItem.uuid)
      updatedForm.schema[index] = parentItem;
      this._form.next(updatedForm);
      //this.setSelectedTreeKey(item.uuid);

    })
  }

  updateFormItem(item:FieldItemModel){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      // find index
//      const index = updatedForm.schema.findIndex(i => i.uuid === item.uuid)
//      updatedForm.schema[index] = item;
      this.updateFieldItem(updatedForm.schema, item)
      this._form.next(updatedForm);
    })
  }


  deleteFormItem(key:string){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === key)
      // remove item from tempFormData
      updatedForm.schema.splice(index, 1);
      // check current selectedTreeKey
      this.selectedTreeKey.pipe(take(1)).subscribe(currKey => {
        // if it matches the passed key, nullify
        if(currKey === key){
          this.nullifySelectedTreeKey()
        }
        // set tempFormData to live
        this._form.next(updatedForm);
      })
    })

    // this.getFieldItemFromTreeKey(key).pipe(take(1)).subscribe(item => {
    //   if(item){
    //     console.log(item)
    //     // find index
    //     const index = updatedForm.schema.findIndex(i => i.uuid === item.uuid)
    //   }
    // }, err => {
    //   console.log(err);
    //   // TODO - handle/display error
    //   console.log("TODO couldn't delete")
    // })
  }

  duplicateFormItem(key:string){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === key)
      // duplicate the item
      const currItem:FieldItemModel = updatedForm.schema[index]
      const uuid:string = uuidv4();
      const newItem:FieldItemModel = {
        ...currItem,
        key:uuid,
        uuid
      }
      //
      const first:FieldItemModel[] = updatedForm.schema.slice(0, index + 1)
      first.push(newItem)
      // place newItem into schema, directly after the original item
      const schema:FieldItemModel[] = first.concat(updatedForm.schema.slice(index + 1, updatedForm.schema.length));
      //
      updatedForm.schema = schema;
      // set tempFormData to live
      this._form.next(updatedForm);
      // set the selectedTreeKey
      this.setSelectedTreeKey(uuid);
    })
  }

  updateFormItemOrdinal(key:string, direction:OrdinalDirectionEnum, increment:number = 1){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }
      const maxIndex:number = updatedForm.schema.length - 1;
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === key)
      //
      if(direction === OrdinalDirectionEnum.UP ? index > 0 : index < maxIndex){
        // get the swapped index depending on the direction
        const swappedIndex = direction === OrdinalDirectionEnum.UP ? index - increment : index + increment;
        // get an instance of the item
        const item:FieldItemModel = updatedForm.schema[index]
        // get an instance of the item to be swapped
        const swappedItem:FieldItemModel = updatedForm.schema[swappedIndex]
        // swap
        updatedForm.schema[index] = swappedItem;
        updatedForm.schema[swappedIndex] = item;
        // set tempFormData to live
        this._form.next(updatedForm);
      }
    })
  }

  getFieldItemFromTreeKey(key:string){
		return this._form.asObservable().pipe(map(form => {
			if(form){
				return this.findFieldItemFromTreeKey(form.schema, key)
			} else{
				return null;
			}
		}))
	}

  getTreeItemFromKey(key:string){
		return this._formTree.asObservable().pipe(map(tree => {
			if(tree){
				return this.findTreeItemFromKey(tree, key)
			} else{
				return null;
			}
		}))
	}

  // RECURSIVE

  // loop through a fieldItemModel fieldGroups
  findFieldItemFromTreeKey(list:FieldItemModel[], key:string):FieldItemModel{
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == key) {
          return list[i];
        }
        let found = this.findFieldItemFromTreeKey(list[i].fieldGroup, key);
        if (found) return found;
      }
    }
  }


  // loop thought the treeModels children
  findTreeItemFromKey(list:FormTreeModel[], key:string):FormTreeModel{
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].key == key) {
          return list[i];
        }
        let found = this.findTreeItemFromKey(list[i].children, key);
        if (found) return found;
      }
    }
  }

  updateFieldItem(list:FieldItemModel[], updatedItem:FieldItemModel):FieldItemModel{
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].uuid == updatedItem.uuid) {
          list[i] = { ...list[i], ...updatedItem}
          return list[i];
        }
        let found = this.updateFieldItem(list[i].fieldGroup, updatedItem);
        if (found) return found;
      }
    }
  }

  getFieldItemFromSelection(selectedField:SelectableFieldItemModel):FieldItemModel{
    const fieldItem:FieldItemModel = {}
    const uuid:string = uuidv4();
    fieldItem.uuid = fieldItem.key = uuid
    fieldItem.label = selectedField.label;
    fieldItem.type = selectedField.type;
    if(selectedField.wrappers){
      fieldItem.wrappers = [ ...selectedField.wrappers ]
    }
    //
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

  updateMetaData(meta:FormMetaModel){
    this.form.pipe(take(1)).subscribe(form => {
      if(form){
        // create tempFormData from existing
        const updatedForm:FormModel = { ...form, meta }
        // set tempFormData to live
        this._form.next(updatedForm);
        this._metaUpdated.next(true);
      }
    })
  }


  getData(url:string){
    return this.http.get<FormModel>(url).pipe(
      tap((data) => {
        const { meta, schema, model } = data;
        console.log(data);
        this._form.next(data);
      })
    )
  }
  setFormFromJson(json:string){
    const updatedForm:FormModel = { ...JSON.parse(json) }
    this._form.next(updatedForm)
  }
  setFormFromModel(model:FormModel){
    this._form.next(model)
  }

  nullifyForm():Observable<boolean>{
    this._form.next(null)
    return of(true);
  }

  resetForm():Observable<boolean>{
    const metaData:FormMetaModel = {
      title:"",
      version:""
    }
    this.initialiseNewForm(metaData);
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
        // trigger the formUpdate subscr
        this._formUpdated.next(true);
      }
    })
  }

  parseFormToTree(schema:FieldItemModel[], currentSelectedKey:string):Observable<FormTreeModel[]>{
    let tree:FormTreeModel[];
    tree = schema.map(f => {
      return this.parseItemToLeaf(f, currentSelectedKey, null);
    })
    return of(tree);
  }

  parseItemToLeaf(item:FieldItemModel, currentSelectedKey:string, parentKey:string):FormTreeModel{
    if(!item.uuid){
      item.uuid = uuidv4();
    }
    let leaf:FormTreeModel = {
      key:item.uuid,
      title:item.label,
      parentKey,
      selected:item.uuid === currentSelectedKey,
      expanded:item.uuid === currentSelectedKey,
    }
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(configItem => {
      leaf.isLeaf = !configItem.editableConfig.hasFieldGroup;
    })
    if(item.fieldGroup){
      const children:FormTreeModel[] = item.fieldGroup.map(f => this.parseItemToLeaf(f, currentSelectedKey, item.uuid));
      if(!leaf.expanded){
        leaf.expanded = children.filter(c => c.selected).length >= 1;
      }
      leaf.children = children;
    }
    return leaf
  }

  setSelectedTreeKey(key:string){
    this._selectedTreeKey.next(key);
  }

  nullifySelectedTreeKey(){
    this._selectedTreeKey.next(null);
  }

  setEditorMode(mode:EditorModeEnum){
    this._editorMode.next(mode);
  }

  saveForm(type:SaveTypeEnum) {
    this.form.pipe(take(1)).subscribe(form => {
      if(form){
        const data:SaveFormModel = {
          type,
          data:JSON.stringify(form)
        }
        this._save.next(data);
      }
    })
	}

  closeFormEditor() {
    this._close.next(true);
	}

  destroy(){
    this.formSubscription.unsubscribe
  }

}
