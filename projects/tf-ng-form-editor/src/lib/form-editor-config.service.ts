import { Injectable } from '@angular/core';
import { Field } from '@ngx-formly/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FieldItemModel } from './to-share/field-item-model.interface';



export interface SelectableFieldItemModel {
  id:string
  type:string
  label:string
  category:SelectableCategory
  description?:string
  editableConfigType?:EditableConfigType
  editableConfig?:SelectableFieldItemEditableConfigModel
}
export interface SelectableFieldItemEditableConfigModel {
  type:EditableConfigType
  id:string,
  setLabel?:boolean
  setDesc?:boolean
  setHelp?:boolean
  setPlaceholder?:boolean
  setRequired?:boolean
  setPermissions?:boolean
  setReadonlyPermissions?:boolean
  setHideExpressions?:boolean
  hasComponentOptions?:boolean
  hasFieldGroup?:boolean
}
export enum SelectableCategory {
  SIMPLE = "Simple",
  COMPLEX = "Complex",
  LAYOUT = "Layout"
}

export enum EditableConfigType {
  GENERAL = 0,
  INPUT = 1,
  SELECT = 2,
  RADIO = 3,
  CHECKBOX = 4,
  RADIO_CHECKBOX = 5,
  LAYOUT = 6
}


@Injectable({
  providedIn: 'root'
})
export class FormEditorConfigService {

  private _types: SelectableFieldItemModel[] = [
    {
      type:"input",
      id:"1",
      label:"Input",
      category:SelectableCategory.SIMPLE,
      description:"Lorum ipsum",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"select",
      id:"2",
      label:"Select Dropdown",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.SELECT
    },
    {
      type:"radio",
      id:"3",
      label:"Radio Select",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX
    },
    {
      type:"checkbox",
      id:"4",
      label:"Checkbox Select",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX
    },
    {
      type:"address",
      id:"6",
      label:"Address",
      category:SelectableCategory.COMPLEX,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX
    },
    {
      type:"tab",
      id:"8",
      label:"Tab",
      category:SelectableCategory.LAYOUT,
      description:"Descriptions explaining the tabs and how to use them etc...",
      editableConfigType:EditableConfigType.LAYOUT
    },
    {
      type:"divider",
      id:"7",
      label:"Divider",
      category:SelectableCategory.LAYOUT,
      description:"Lorum ipsum divider ...",
      editableConfigType:EditableConfigType.LAYOUT
    }
  ]

  readonly _editableConfigs: SelectableFieldItemEditableConfigModel[] = [
    {
      type:EditableConfigType.INPUT,
      id:"100",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:true,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      setHideExpressions:false,
      hasComponentOptions:false,
      hasFieldGroup:false,
    },
    {
      type:EditableConfigType.SELECT,
      id:"101",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:true,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      setHideExpressions:false,
      hasComponentOptions:true,
      hasFieldGroup:false,
    },
    {
      type:EditableConfigType.RADIO_CHECKBOX,
      id:"102",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:false,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      setHideExpressions:false,
      hasComponentOptions:true,
      hasFieldGroup:false,
    },
    {
      type:EditableConfigType.LAYOUT,
      id:"103",
      setLabel:false,
      setDesc:false,
      setHelp:false,
      setPlaceholder:false,
      setRequired:false,
      setPermissions:false,
      setReadonlyPermissions:false,
      setHideExpressions:false,
      hasComponentOptions:true,
      hasFieldGroup:false,
    }
  ]
  private _selectableItems = new BehaviorSubject<SelectableFieldItemModel[]>(this._types);
  private _selectableItem = new Subject<SelectableFieldItemModel>()

  get selectableItems(){
    return this._selectableItems.asObservable().pipe(map(items => {
      if(items){
        return [ ...items ]
      }else{
        return null;
      }
    }))
  }

  getSelectableItemFromType(type:string){
    return this._selectableItems.asObservable().pipe(map((items, index) => {
      if(items){
        const typeItems:SelectableFieldItemModel[] = items.filter(item => item.type === type);
        if(typeItems.length){
          const model:SelectableFieldItemModel = typeItems[0];
          //
          if(!model.editableConfig){
            // find editable config
            const editableConfigModel:SelectableFieldItemEditableConfigModel = this._editableConfigs.filter(c => c.type === model.editableConfigType)[0];
            // add it to the selectableItems model so we don't need to do it for every instance
            this._types[index].editableConfig = model.editableConfig = editableConfigModel;
          }
          //
          return model;
        }else{
          return null;
        }
      }else{
        return null;
      }
    }))
  }

  getSelectableItemFromId(id:string){
    return this._selectableItems.asObservable().pipe(map(items => {
      if(items){
        const typeItems:SelectableFieldItemModel[] = items.filter(item => item.id === id);
        if(typeItems.length){
          return typeItems[0];
        }else{
          return null;
        }
      }else{
        return null;
      }
    }))
  }

  constructor() { }

}
