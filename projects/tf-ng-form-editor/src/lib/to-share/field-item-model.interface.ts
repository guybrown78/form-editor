export interface FieldItemModel {
  uuid?:string
  type?:string
  label?:string
  placeholder?:string
  help?:string
  description?:string
  key?:string
  wrappers?:string[] | string
  required?:boolean
  permissions?:any[]
  readonlyPermissions?:any[]
  hideExpression?:boolean
  componentOptions?:any
  fieldGroup?:FieldItemModel[]
}
