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
  disableEdit?:boolean
  setLabel?:boolean
  setDesc?:boolean
  setHelp?:boolean
  setPlaceholder?:boolean
  multiplePlaceholders?:boolean
  setRequired?:boolean
  setPermissions?:boolean
  setReadonlyPermissions?:boolean
  setHideExpressions?:boolean
  hasComponentOptions?:boolean
  hasFieldGroup?:boolean
  hasLayoutOptions?:boolean
  hasShowBlocks?:boolean
  hasGridOptions?:boolean
  hasDateOptions?:boolean
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
  STATIC,
  TEXT,
  NESTED,
  GRID,
  TABS,
  TAB,
  DATE
}

@Injectable({
  providedIn: 'root'
})
export class FormEditorConfigService {

  private _types: SelectableFieldItemModel[] = [
    {
      type:"text",
      id:"text",
      label:"Paragraph",
      description:"Good for introducing the form or key parts. It allows you to add text and images",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.TEXT
    },
    {
      type:"input",
      id:"input",
      label:"Text Input",
      category:SelectableCategory.SIMPLE,
      description:"Allow the form user to add a single line of text",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"number",
      id:"number",
      label:"Number Input",
      category:SelectableCategory.SIMPLE,
      description:"Allow the form user to add a number",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"email",
      id:"email",
      label:"Email Input",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      description:"Allow the form user to add a email address",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"text-area",
      id:"text-area",
      label:"Multiline Text Input",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      description:"Allow the form user to add multiple lines of text",
      editableConfigType:EditableConfigType.INPUT
    },
    {
      type:"select",
      id:"select",
      label:"Dropdown Select",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.SELECT
    },

    {
      type:"radio-group",
      id:"radio-group",
      label:"Single Select",
      description:"For when you want the user to give a single answer to a question or statement",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.CHECKBOX_GROUP,
      editableConfigOptionsName:"checkboxOptions"
    },

    {
      type:"checkbox-group",
      id:"checkbox-group",
      label:"Multi Select",
      description:"Ideal for when you want the user to have multiple options to choose from",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.CHECKBOX_GROUP,
      editableConfigOptionsName:"checkboxOptions"
    },
    {
      type:"rate",
      id:"rate",
      label:"Rating",
      description:"For when you want to ask the form user to give a star rating for something",
      wrappers:[SelectableWrapper.FORM_FIELD],
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.CHECKBOX,
      editableConfigOptionsName:"rateOptions"
    },
    {
      type:"date",
      id:"date",
      label:"Date",
      wrappers:[SelectableWrapper.DATE_FIELD],
      description:"Allow the form user to add key dates such as their date of birth",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.DATE,
      editableConfigOptionsName:"dateOptions"
    },
    {
      type:"date-range",
      id:"date-range",
      label:"Date Range",
      wrappers:[SelectableWrapper.DATE_FIELD],
      description:"For when you want to capture a range of dates such as start and end date",
      category:SelectableCategory.SIMPLE,
      editableConfigType:EditableConfigType.DATE,
      editableConfigOptionsName:"dateOptions"
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
      label:"Sections",
      category:SelectableCategory.LAYOUT,
      description:"This allows you to break down longer forms into multiple sections",
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
      type:"radio",
      id:"radio",
      label:"Radio Select",
      category:SelectableCategory.HIDDEN,
      editableConfigType:EditableConfigType.RADIO
    },
    {
      type:"checkbox",
      id:"checkbox",
      label:"Single Checkbox",
      category:SelectableCategory.HIDDEN,
      editableConfigType:EditableConfigType.CHECKBOX
    },

    {
      type:"divider",
      id:"divider",
      label:"Divider",
      category:SelectableCategory.LAYOUT,
      description:"A graphical divider that helps to break up key parts of your form",
      editableConfigType:EditableConfigType.STATIC
    },

    {
      type:"nested",
      id:"nested",
      label:"Combinations",
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
      type:EditableConfigType.STATIC,
      id:"config-static",
      disableEdit:true,
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
    {
      type:EditableConfigType.DATE,
      id:"config-date",
      setLabel:true,
      setDesc:true,
      setHelp:true,
      setPlaceholder:true,
      multiplePlaceholders:true,
      setRequired:true,
      setPermissions:true,
      setReadonlyPermissions:true,
      hasDateOptions:true
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


  readonly preDefinedComplexItems:FieldItemModel[] = [
    {
      type:"address",
      label:"Address",
      componentOptions:{},
      fieldGroup:[
        {
          type:"input",
          key:"addressLine1",
          label:"Address Line 1",
          required:true
        },
        {
          type:"input",
          key:"addressLine2",
          label:"Address Line 2"
        },
        {
          type:"input",
          key:"town",
          label:"Town",
          required:true
        },
        {
          type:"input",
          key:"county",
          label:"County",
          required:true
        },
        {
          type:"input",
          key:"postcode",
          label:"Postcode",
          required:true
        }
      ]
    },
    {
      type:"grid",
      componentOptions: {
        gridOptions: {
          columnCount: 1,
          columnWidths: [ 24 ],
          columnDefs: [
            { width: 24 }
          ]
        }
      }
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
