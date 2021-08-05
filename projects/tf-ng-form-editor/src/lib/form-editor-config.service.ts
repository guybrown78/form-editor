import { Injectable } from '@angular/core';
import { Field } from '@ngx-formly/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FieldItemModel, SelectableWrapper } from './to-share/field-item-model.interface';


export interface EditorItemModel {
  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel
}

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
  hasGridOptions?:boolean
}
export enum SelectableCategory {
  SIMPLE = "Simple",
  COMPLEX = "Complex",
  LAYOUT = "Layout",
  HIDDEN = "Hidden"
}
export interface SelectableGridColumnDefinitions {
  label:string;
  id:string;
  column:number;
  columnWidths?:SelectableGridColumnWidths[];
}
export interface SelectableGridColumnWidths {
  label:string;
  widths:number[];
  default?:boolean;
}
export enum EditableConfigType {
  GENERAL,
  INPUT,
  SELECT,
  RADIO,
  CHECKBOX,
  CHECKBOX_GROUP,
  LAYOUT,
  TEXT,
  NESTED,
  GRID,
  TABS,
  TAB,
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
      editableConfigType:EditableConfigType.RADIO
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
      editableConfigType:EditableConfigType.CHECKBOX_GROUP,
      editableConfigOptionsName:"checkboxOptions"
    },
    {
      type:"address",
      id:"address",
      label:"Address",
      category:SelectableCategory.COMPLEX,
      editableConfigType:EditableConfigType.NESTED
    },
    {
      type:"tabs",
      id:"tabs",
      label:"Tabs",
      category:SelectableCategory.LAYOUT,
      description:"Descriptions explaining the tabs and how to use them etc...",
      editableConfigType:EditableConfigType.TABS
    },
    {
      type:"tab",
      id:"tab",
      label:"Tab",
      category:SelectableCategory.HIDDEN,
      editableConfigType:EditableConfigType.TAB
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
    },
    {
      type:"nested",
      id:"nested",
      label:"Nested",
      category:SelectableCategory.COMPLEX,
      editableConfigType:EditableConfigType.NESTED
    },
    {
      type:"grid",
      id:"grid",
      label:"Grid",
      category:SelectableCategory.COMPLEX,
      editableConfigType:EditableConfigType.GRID,
      editableConfigOptionsName:"gridOptions"
    },
    {
      type:"grid-row",
      id:"grid-row",
      label:null,
      category:SelectableCategory.HIDDEN,
      editableConfigType:EditableConfigType.GENERAL
    },
    {
      type:"empty-grid-cell",
      id:"empty",
      label:null,
      category:SelectableCategory.HIDDEN,
      editableConfigType:EditableConfigType.GENERAL
    },
  ]

  readonly _editableConfigs: SelectableFieldItemEditableConfigModel[] = [
    {
      type:EditableConfigType.INPUT,
      id:"config-input",
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
      id:"config-select",
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
      type:EditableConfigType.RADIO,
      id:"config-radio",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:false,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      setHideExpressions:false,
      hasComponentOptions:true,
    },
    {
      type:EditableConfigType.LAYOUT,
      id:"config-layout",
      setLabel:false,
      setDesc:false,
      setHelp:false,
      setPlaceholder:false,
      setRequired:false,
      setPermissions:false,
      setReadonlyPermissions:false,
      setHideExpressions:false,
      hasComponentOptions:true,
    },
    {
      type:EditableConfigType.TEXT,
      id:"config-text",
      setLabel:true,
      setDesc:true
    },
    {
      type:EditableConfigType.CHECKBOX,
      id:"config-checkbox",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
    },
    {
      type:EditableConfigType.CHECKBOX_GROUP,
      id:"config-checkbox-group",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:false,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      setHideExpressions:false,
      hasComponentOptions:true,
      hasLayoutOptions:true,
      hasShowBlocks:true
    },
    {
      type:EditableConfigType.NESTED,
      id:"config-nested",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      hasFieldGroup:true
    },
    {
      type:EditableConfigType.TABS,
      setLabel:true,
      id:"config-tabs",
      hasFieldGroup:true
    },
    {
      type:EditableConfigType.TAB,
      id:"config-tab",
      setLabel:true,
      hasFieldGroup:true
    },
    {
      type:EditableConfigType.GRID,
      id:"config-grid",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      hasGridOptions:true,
    },
    {
      type:EditableConfigType.GENERAL,
      id:"config-general"
    },
  ]


  readonly _columnDefinitions: SelectableGridColumnDefinitions[] = [
    {
      id:"oneCol",
      label:"One Column",
      column:1,
      columnWidths:[
        {
          label:"24",
          widths:[24],
          default: true
        }
      ]
    },
    {
      id:"twoCol",
      label:"Two Columns",
      column:2,
      columnWidths:[
        {
          label:"16-8",
          widths:[16,8],
          default: true
        },
        {
          label:"8-16",
          widths:[8,16]
        },
        {
          label:"12-12",
          widths:[12,12]
        }
      ]
    },
    {
      id:"threeCol",
      label:"Three Columns",
      column:3,
      columnWidths:[
        {
          label:"12-6-6",
          widths:[12,6,6],
          default: true
        },
        {
          label:"8-8-8",
          widths:[8,8,8]
        },
        {
          label:"10-10-4",
          widths:[10,10,4]
        }

      ]
    },
    {
      id:"fourCol",
      label:"Four Columns",
      column:4,
      columnWidths:[
        {
          label:"9-5-5-5",
          widths:[9,5,5,5],
          default: true
        },
        {
          label:"6-6-6-6",
          widths:[6,6,6,6]
        }
      ]
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
