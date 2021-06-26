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
  editableConfig?:SelectableFieldItemEditableConfigModel
}
export interface SelectableFieldItemEditableConfigModel {
  setHelp?:boolean
}
export enum SelectableCategory {
  SIMPLE = "Simple",
  COMPLEX = "Complex",
  LAYOUT = "Layout"
}

@Injectable({
  providedIn: 'root'
})
export class FormEditorConfigService {

  readonly _types: SelectableFieldItemModel[] = [
    {
      type:"input",
      id:"1",
      label:"Input",
      category:SelectableCategory.SIMPLE,
      description:"Lorum ipsum",
    },
    {
      type:"select",
      id:"2",
      label:"Select Dropdown",
      category:SelectableCategory.SIMPLE
    },
    {
      type:"radio",
      id:"3",
      label:"Radio Select",
      category:SelectableCategory.SIMPLE
    },
    {
      type:"checkbox",
      id:"4",
      label:"Checkbox Select",
      category:SelectableCategory.SIMPLE
    },
    {
      type:"address",
      id:"6",
      label:"Address",
      category:SelectableCategory.COMPLEX
    },
    {
      type:"tab",
      id:"8",
      label:"Tab",
      category:SelectableCategory.LAYOUT,
      description:"Descriptions explaining the tabs and how to use them etc..."
    },
    {
      type:"divider",
      id:"7",
      label:"Divider",
      category:SelectableCategory.LAYOUT,
      description:"Lorum ipsum divider ..."
    }
  ]

  readonly _editableFields: any[] = [
    {
      type:"inputType",
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
      type:"selectType",
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
      componentOptionsType:"dropdown"
    },
    {
      type:"radioCheckType",
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
      componentOptionsType:"singleSelect"
    },
    {
      type:"layoutType",
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
      componentOptionsType:"singleSelect"
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
    return this._selectableItems.asObservable().pipe(map(items => {
      if(items){
        const typeItems:SelectableFieldItemModel[] = items.filter(item => item.type === type);
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
