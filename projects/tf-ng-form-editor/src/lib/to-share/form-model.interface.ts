import { FieldItemModel } from "./field-item-model.interface"
import { FormMetaModel } from "./form-meta-model.interface"

export interface FormModel {
  meta:FormMetaModel
  schema:FieldItemModel[]
  model:any
}
