
export interface FieldItemComponentOptionsModel {
  options?:OptionModel[]
  layout?:FieldItemLayoutOption
  showBlocks?:boolean
  checkboxOptions?:FieldItemOptionsModel
  gridOptions?:FieldItemGridOptionsModel
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
