import { NullVisitor } from "@angular/compiler/src/render3/r3_ast";

export interface FieldItemComponentOptionsModel {
  options?:OptionModel[]
  layout?:FieldItemLayoutOption
  showBlocks?:boolean
  type?:FieldItemType
  min?:number
  max?:number
  checkboxOptions?:FieldItemOptionsModel
  gridOptions?:FieldItemGridOptionsModel
  dateOptions?:FieldItemDateOptionsModel
  tabsOptions?:FieldItemTabOptionsModel
}
export interface FieldItemOptionsModel {
  layout?:FieldItemLayoutOption
  showBlocks?:boolean
}
export interface OptionModel {
  label:string,
  value:string
}


export enum FieldItemLayoutOption {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal"
}

export enum FieldItemType {
  NUMBER = "number",
  PASSWORD = "password"
}

export interface FieldItemGridOptionsModel {
  columnCount?:number,
  columnWidths?:number[],
  columnDefs?:FieldItemGridOptionsColumnDefsModel[]
}
export interface FieldItemGridOptionsColumnDefsModel {
  headerName?:string,
  field?:string,
  width?:number
}

export interface FieldItemTabOptionsModel {
  size?:string,
  submitLabel?:string,
  showSubmitButton?:boolean
}
export interface FieldItemDateOptionsModel {
  mode?:string,
  format?:string,
}
export enum FieldItemDateModeOption {
  DEFAULT = "",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year"
}
