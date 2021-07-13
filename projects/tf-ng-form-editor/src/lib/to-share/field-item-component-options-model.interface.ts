
export interface FieldItemComponentOptionsModel {
  options?:OptionModel[]
  layout?:FieldItemLayoutOption
}
export interface OptionModel {
  label:string,
  value:string
}


export enum FieldItemLayoutOption {
  VERTICAL = "vertical",
  HORIZONTAL = "horizontal"
}
