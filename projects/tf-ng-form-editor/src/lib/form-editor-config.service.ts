import { Injectable } from '@angular/core';
import { FieldItemModel } from './to-share/field-item-model.interface';



export interface SelectableFieldItemModel {
  id:string
  type:string
  label:string
  category:SelectableCategory
}

export enum SelectableCategory {
  SIMPLE = "Simple",
  COMPLEX = "Complex"
}

@Injectable({
  providedIn: 'root'
})
export class FormEditorConfigService {

  types: SelectableFieldItemModel[] = [
    {
      type:"input", id:"1", label:"Input",
      category:SelectableCategory.SIMPLE
    },
    {
      type:"select", id:"2", label:"Select Dropdown", category:SelectableCategory.SIMPLE
    },
    {
      type:"radio", id:"3", label:"Radio Select",
      category:SelectableCategory.SIMPLE
    },
    {
      type:"checkbox", id:"4", label:"Checkbox Select", category:SelectableCategory.SIMPLE
    },
    {
      type:"address", id:"6", label:"Address", category:SelectableCategory.COMPLEX
    }
  ]

  constructor() { }

}
