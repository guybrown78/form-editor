import { FieldItemComponentOptionsModel } from './field-item-component-options-model.interface'



// wrappers?:SelectableWrapper[] | SelectableWrapper | string
export interface FieldItemModel {
  uuid?:string
  key?:string
  type?:string
  label?:string
  placeholder?:string[] | string
  help?:string
  description?:string
  wrappers?:SelectableWrapper[]
  required?:boolean
  permissions?:any[]
  readonlyPermissions?:any[]
  hideExpression?:boolean
  componentOptions?:FieldItemComponentOptionsModel
  fieldGroup?:FieldItemModel[]
}


export enum SelectableWrapper {
  FORM_FIELD = "form-field",
  DATE_FIELD = "date-field",
  GRID_CELL_FIELD = "grid-cell-field",
}
