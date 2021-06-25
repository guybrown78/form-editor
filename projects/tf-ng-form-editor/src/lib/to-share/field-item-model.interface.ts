export interface FieldItemModel {
  uuid?:string
  key?:string
  type?:string
  label?:string
  placeholder?:string
  help?:string
  description?:string
  wrappers?:string[] | string
  required?:boolean
  permissions?:any[]
  readonlyPermissions?:any[]
  hideExpression?:boolean
  componentOptions?:any
  fieldGroup?:FieldItemModel[]
}
