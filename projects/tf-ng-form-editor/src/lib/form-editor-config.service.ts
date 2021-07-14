import { Injectable } from '@angular/core';
import { Field } from '@ngx-formly/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FieldItemModel, SelectableWrapper } from './to-share/field-item-model.interface';



export interface SelectableFieldItemModel {
  id:string
  type:string
  label:string
  category:SelectableCategory
  description?:string
  wrappers?:SelectableWrapper[]
  editableConfigType?:EditableConfigType
  editableConfig?:SelectableFieldItemEditableConfigModel
  editableConfigOptionsName?:string
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
  hasLayoutOptions?:boolean
  hasShowBlocks?:boolean
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
  LAYOUT = 6,
  TEXT = 7
}

@Injectable({
  providedIn: 'root'
})
export class FormEditorConfigService {

  private _types: SelectableFieldItemModel[] = [
    {
      type:"input",
      id:"input",
      label:"Input",
      category:SelectableCategory.SIMPLE,
      description:"Lorum ipsum",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"select",
      id:"select",
      label:"Select Dropdown",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.SELECT
    },
    {
      type:"radio",
      id:"radio",
      label:"Radio Select",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX
    },
    {
      type:"checkbox",
      id:"checkbox",
      label:"Checkbox Single Select",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.CHECKBOX
    },
    {
      type:"checkbox-group",
      id:"checkbox-group",
      label:"Checkbox Group",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX,
      editableConfigOptionsName:"checkboxOptions"
    },
    {
      type:"address",
      id:"address",
      label:"Address",
      category:SelectableCategory.COMPLEX,
      editableConfigType:EditableConfigType.RADIO_CHECKBOX
    },
    {
      type:"tab",
      id:"tab",
      label:"Tab",
      category:SelectableCategory.LAYOUT,
      description:"Descriptions explaining the tabs and how to use them etc...",
      editableConfigType:EditableConfigType.LAYOUT
    },
    {
      type:"divider",
      id:"divider",
      label:"Divider",
      category:SelectableCategory.LAYOUT,
      description:"Lorum ipsum divider ...",
      editableConfigType:EditableConfigType.LAYOUT
    },
    {
      type:"text",
      id:"text",
      label:"Text",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.TEXT
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
      setReadonlyPermissions:true
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
      hasLayoutOptions:true,
      hasShowBlocks:true
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
    },
    {
      type:EditableConfigType.TEXT,
      id:"104",
      setLabel:true,
      setDesc:true
    },
    {
      type:EditableConfigType.CHECKBOX,
      id:"105",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
    },
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
          const model:SelectableFieldItemModel = { ...typeItems[0] };
          //

            // find editable config
            const editableConfigModel:SelectableFieldItemEditableConfigModel = this._editableConfigs.filter(c => c.type === model.editableConfigType)[0];
            // add it to the selectableItems model
            this._types[index].editableConfig = model.editableConfig = editableConfigModel;
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
