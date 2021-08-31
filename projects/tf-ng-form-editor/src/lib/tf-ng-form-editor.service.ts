import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError, Observable, Subscription } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormModel } from './to-share/form-model.interface';
import { FieldItemModel } from './to-share/field-item-model.interface';
import { FormEditorConfigService, SelectableCategory, SelectableFieldItemModel } from './form-editor-config.service';
import { v4 as uuidv4 } from 'uuid';
import { FormMetaModel } from './to-share/form-meta-model.interface';
import { FieldItemType } from './to-share/field-item-component-options-model.interface';
import { NzModalService } from 'ng-zorro-antd/modal';






export interface FormTreeModel {
  title:string
  key:string
  parentKey?:string
  selected?:boolean
  children?:FormTreeModel[]
  expanded?:boolean
  isLeaf?:boolean
  isTab?:boolean
}
export interface SaveFormModel {
  type:SaveTypeEnum
  data:string
}
export enum EditorModeEnum {
  EDIT = "edit",
  PREVIEW = "preview",
  NONE = "none",
}
export enum SaveTypeEnum {
  DRAFT = "draft",
  PUBLISH = "publish",
}
export enum OrdinalDirectionEnum {
  UP,
  DOWN,
}
export interface CheckFormMetaData {
  title?:string
  allowTitle?:CheckFormMetaDataStatus
  titleErrMessage?:string
  code?:string
  allowCode?:CheckFormMetaDataStatus
  codeErrMessage?:string
}
export enum CheckFormMetaDataStatus {
  UNSET = -1,
  PENDING = 0,
  ALLOW = 1,
  DISALLOW = 2,
}


@Injectable({
  providedIn: 'root'
})
export class TfNgFormEditorService implements OnDestroy {
  formSubscription:Subscription
  formUpdateSubscription:Subscription
  unsavedItems:boolean = false;
  // Observable sources
  private _form = new BehaviorSubject<FormModel>(null);
  private _formTree = new BehaviorSubject<FormTreeModel[]>(null);
  private _selectedTreeKey = new BehaviorSubject<string>(null);
  private _editorMode = new BehaviorSubject<EditorModeEnum>(EditorModeEnum.EDIT);
  private _metaUpdated = new Subject<boolean>();
  private _formUpdated = new Subject<boolean>();
  private _save = new Subject<SaveFormModel>();
  private _close = new Subject<boolean>();
  private _checkFormMetaOutput = new Subject<CheckFormMetaData>();
  private _checkFormMetaInput = new Subject<CheckFormMetaData>();

  // Observable stream
  form = this._form.asObservable();
  formTree = this._formTree.asObservable();
  selectedTreeKey = this._selectedTreeKey.asObservable();
  editorMode = this._editorMode.asObservable();
  metaUpdated = this._metaUpdated.asObservable();
  formUpdated = this._formUpdated.asObservable();
  save = this._save.asObservable();
  close = this._close.asObservable();
  checkFormMetaOutput = this._checkFormMetaOutput.asObservable();
  checkFormMetaInput = this._checkFormMetaInput.asObservable();

  constructor(
    private http: HttpClient,
    private formEditorConfig:FormEditorConfigService,
    private modal:NzModalService,

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

  addTabsFormItem(item:FieldItemModel){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      //const uuid:string = uuidv4();
      const fieldGroup:FieldItemModel[] = new Array()
      form.schema.map(fi => {
        fieldGroup.push({ ...fi });
      });
      // Get Tab config item
      this.formEditorConfig.getSelectableItemFromId('tab').pipe(take(1)).subscribe(tabSelectableItem => {
        // Create tab
        const tabItem = this.getFieldItemFromSelection(tabSelectableItem)
        tabItem.label = "Default Tab";
        tabItem.key = "defaultTab";
        tabItem.fieldGroup = [ ...fieldGroup ]

        item.fieldGroup = [];
        item.fieldGroup.push(tabItem)
        const updatedForm:FormModel = {
          meta:form.meta,
          schema:[],
          model:form.model
        }
        updatedForm.schema.push({ ...item });
        this.setSelectedTreeKey(item.uuid);
        this._form.next(updatedForm);
      })

    })
  }

  addFormItemToFieldGroup(parentItem:FieldItemModel, item:FieldItemModel, ordinum:number | null = null){
    if(!parentItem.fieldGroup){
      parentItem.fieldGroup = [];
    }
    if(ordinum === null){
      parentItem.fieldGroup.push(item);
    }else{
      parentItem.fieldGroup[ordinum] = item
    }
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === parentItem.uuid)
      updatedForm.schema[index] = parentItem;
      this._form.next(updatedForm);
    })
  }

  updateFormItemsFieldGroup(formItem:FieldItemModel, fieldGroup:FieldItemModel[]){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      // find index
      const index = updatedForm.schema.findIndex(i => i.uuid === formItem.uuid)
      formItem.fieldGroup = [ ...fieldGroup ];
      updatedForm.schema[index] = {
        ...formItem
      };

      this._form.next(updatedForm);
    })
  }

  updateFormItem(item:FieldItemModel){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempory form data from existing
      const updatedForm:FormModel = { ...form }
      // find index
//      const index = updatedForm.schema.findIndex(i => i.uuid === item.uuid)
//      updatedForm.schema[index] = item;
      this.updateFieldItem(updatedForm.schema, item);
      setTimeout(() => {
        this._form.next(updatedForm);
      }, 50);

    })
  }


  deleteFormItem(key:string, parentKey:string = null){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }


      // // get parent FieldItem fields
      const parentItemFields:FieldItemModel[] = parentKey ? this.findFieldItemFromTreeKey(updatedForm.schema, parentKey).fieldGroup : updatedForm.schema;


      // find index
      const index = parentItemFields.findIndex(i => i.uuid === key)

      // remove item from tempFormData
      parentItemFields.splice(index, 1);

      // check current selectedTreeKey
      this.selectedTreeKey.pipe(take(1)).subscribe(currKey => {
        // if it matches the passed key, nullify
        if(currKey === key){
          // this.nullifySelectedTreeKey()
          this._selectedTreeKey.next(parentKey)
        }
        // set tempFormData to live
        this._form.next(updatedForm);
      })
    })
  }

  getUuid(){
    return uuidv4();
  }
  duplicateFormItem(key:string, parentKey:string = null){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }

      // get parent FieldItem=
      const parentItem:FieldItemModel = parentKey ? this.findFieldItemFromTreeKey(updatedForm.schema, parentKey) : {};

      // get a list of the current fields
      const currFields:FieldItemModel[] = parentKey ? parentItem.fieldGroup : updatedForm.schema;

      // find index of the item we are duplicating
      const index = currFields.findIndex(i => i.uuid === key)

      // duplicate the item
      const currItem:FieldItemModel = { ...currFields[index]}
      const uuid:string = this.getUuid();
      const newItem:FieldItemModel = {
        ...currItem,
        key:uuid,
        uuid
      }

      // add the new item back into the a list
      let fields:FieldItemModel[] = currFields.reduce((res, current, i) => {
        if(i === index){
          return res.concat([current, newItem])
        }
        return res.concat([current]);
      }, []);

      // replace the current fields list with the new one
      if(parentKey){
        parentItem.fieldGroup = [ ...fields];
      }else{
        updatedForm.schema = [ ...fields];
      }

      // set tempFormData to live
      this._form.next(updatedForm);
      // set the selectedTreeKey
      this.setSelectedTreeKey(uuid);
    })
  }

  updateFormItemOrdinal(key:string, direction:OrdinalDirectionEnum, parentKey:string = null, increment:number = 1){
    this.form.pipe(take(1)).subscribe(form => {
      // create tempFormData from existing
      const updatedForm:FormModel = { ...form }

      // get parent FieldItem fields
      const parentItemFields:FieldItemModel[] = parentKey ? this.findFieldItemFromTreeKey(updatedForm.schema, parentKey).fieldGroup : updatedForm.schema;

      const maxIndex:number = parentItemFields.length - 1;
      // find index
      const index = parentItemFields.findIndex(i => i.uuid === key)
      //
      if(direction === OrdinalDirectionEnum.UP ? index > 0 : index < maxIndex){
        // get the swapped index depending on the direction
        const swappedIndex = direction === OrdinalDirectionEnum.UP ? index - increment : index + increment;
        // get an instance of the item
        const item:FieldItemModel = parentItemFields[index]
        // get an instance of the item to be swapped
        const swappedItem:FieldItemModel = parentItemFields[swappedIndex]
        // swap
        parentItemFields[index] = swappedItem;
        parentItemFields[swappedIndex] = item;
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

  // loop thought the treeModels children for any that are selectrs
  isTreeChildSelected(list:FormTreeModel[]):boolean{
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].selected) {
          return true;
        }
        if(list[i].children){
          const flag = this.isTreeChildSelected(list[i].children);
          if (flag) return flag;
        }
      }
    }
  }

  getFieldItemFromSelection(selectedField:SelectableFieldItemModel):FieldItemModel{
    let fieldItem:FieldItemModel = {}
    const uuid:string = this.getUuid();
    fieldItem.uuid = fieldItem.key = uuid
    fieldItem.label = selectedField.label;
    fieldItem.type = selectedField.type;
    if(selectedField.wrappers){
      fieldItem.wrappers = [ ...selectedField.wrappers ]
    }
    // check if complex
    if(selectedField.category === SelectableCategory.COMPLEX){
      // if so, set pre defined data to the fieldItem
      const predefinedItem:FieldItemModel = this.formEditorConfig.preDefinedComplexItems.filter(item => item.type === selectedField.type)[0];
      if(predefinedItem){
        fieldItem = {
          ...fieldItem,
          ...predefinedItem
        }
      }
    }
    return fieldItem;
  }


  initialiseNewForm(meta:FormMetaModel){
    this.nullifyForm().subscribe(success => {
      this._form.next({
        meta,
        schema: [],
        model: {}
      });
      this.unsavedItems = false;
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
        this._form.next(data);
        this.unsavedItems = false;
        this._metaUpdated.next(true)
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
    this.unsavedItems = false;
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
        if(!this.formUpdateSubscription){
          this.initialiseFormUpdateSubscription()
        }
      }
    })
  }

  initialiseFormUpdateSubscription(){
    this.formUpdateSubscription = this.formUpdated.subscribe(updated => {
      if(updated){
        // changes have been made, able to save
        this.unsavedItems = true;
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
      item.uuid = this.getUuid();
    }
    let leaf:FormTreeModel = {
      key:item.uuid,
      title:item.label,
      parentKey,
      selected:item.uuid === currentSelectedKey,
      expanded:item.uuid === currentSelectedKey,
    }
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(configItem => {
      if(configItem){
        leaf.isLeaf = !configItem.editableConfig.hasFieldGroup;
      }
    })

    if(item.fieldGroup){
      const children:FormTreeModel[] = item.fieldGroup.map(f => this.parseItemToLeaf(f, currentSelectedKey, item.uuid));
      if(item.type === 'tabs'){
        leaf.expanded = true;
        leaf.isTab = true;
      }else if(!leaf.expanded){
        leaf.expanded = this.isTreeChildSelected(children);
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
        this.unsavedItems = false;
      }
    })
	}

  closeFormEditor() {
    this._close.next(true);
	}


  checkFormMetaDataOutput(data:CheckFormMetaData){
    this._checkFormMetaOutput.next(data);
  }
  checkFormMetaDataInput(data:CheckFormMetaData){
    this._checkFormMetaInput.next(data);
  }

  async canDeactivate() {

    let promiseResolve, promiseReject;
    const promise = new Promise(function(resolve, reject){
      promiseResolve = resolve;
      promiseReject = reject;
    });
    if(this.unsavedItems){
      // changes have been made, able to save
      // return window.confirm('Discard changes?');
      this.modal.confirm({
        nzTitle: 'You have unsaved changes to your form.',
        nzContent: `
          <p>If you close this form without saving, you will lose your changes.</p>
          <p>Are you sure you want to close the form editor with unsaved changes?</p>`,
        nzCancelText:'Cancel',
        nzOnCancel: async () => {
          promiseResolve(false)
          return true;
        },
        nzOkText:'Yes, close form without saving',
        nzOnOk: async () => {
          promiseResolve(true)
          return true;
        }

      })

    }else{
      promiseResolve(true)
    }
    return promise;
  }


  ngOnDestroy(){
    this.formSubscription.unsubscribe()
    this.formUpdateSubscription.unsubscribe()
  }

}
