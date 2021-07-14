
export interface FieldItemComponentOptionsModel {
  options?:OptionModel[]
  layout?:FieldItemLayoutOption
  showBlocks?:boolean
  checkboxOptions?:FieldItemOptionsModel
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
