import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';
import { FormTreeModel, OrdinalDirectionEnum, TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';
import {
  FieldItemComponentOptionsModel,
  OptionModel,
  FieldItemGridOptionsModel
} from '../../to-share/field-item-component-options-model.interface';

@Component({
  selector: 'form-editor-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  selectedKeySubscription:Subscription
  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  form: FormGroup;
  treeItem:FormTreeModel

  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.initialiseFormSubscription()
  }

  initialiseFormSubscription(){
    this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {
      if(key){
        this.fieldItem = null;
        this.selectableItem = null;
        if(this.form){
          this.form.reset();
        }

        this.formEditorService.getFieldItemFromTreeKey(key).subscribe(
          item => {

            if(item){


              this.fieldItem = item;

              this.formEditorService.getTreeItemFromKey(item.uuid).pipe(take(1)).subscribe(treeItem => {
                if(treeItem){


                  this.treeItem = treeItem;

                  // when item has been inited get config data...
                  this.formEditorConfig.getSelectableItemFromType(item.type).subscribe(selectableItem => {
                    if(selectableItem){
                      this.selectableItem = selectableItem;
                      this.initForm();
                    }else{
                      this.selectableItem = null;
                    }
                  })


                }
              })


            }else{
              this.fieldItem = null;
            }
          }
        )
      }else{
        this.fieldItem = null;
        this.selectableItem = null;
      }
    })
  }


  initForm(): void {
    this.form = this.fb.group({});

    // label
    if(this.selectableItem.editableConfig.setLabel){
      this.form.addControl('label', new FormControl(this.fieldItem.label, []))
    }
    // description
    if(this.selectableItem.editableConfig.setDesc){
      this.form.addControl('description', new FormControl(this.fieldItem.description, []))
    }
    // placeholder
    if(this.selectableItem.editableConfig.setPlaceholder){
      this.form.addControl('placeholder', new FormControl(this.fieldItem.placeholder, []))
    }
    // hasComponentOptions
    if(this.selectableItem.editableConfig.hasComponentOptions){
      this.form.addControl('componentOptions', new FormControl(this.fieldItem.componentOptions, []))
    }
    // hasFieldGroup
    if(this.selectableItem.editableConfig.hasFieldGroup){
      this.form.addControl('fieldGroup', new FormControl(this.fieldItem.fieldGroup, []))
    }

    this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = {
        ...this.fieldItem,
        ...this.form.value
      }
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }


  onOptionsUpdated(options:OptionModel[]){
    this.updateComponentOptions({
      ...this.fieldItem.componentOptions,
      options
    })
  }
  onGridOptionsUpdated(gridOptions:FieldItemGridOptionsModel){
    this.updateComponentOptions({
      ...this.fieldItem.componentOptions,
      gridOptions
    })
  }
  updateComponentOptions(componentOptions:FieldItemComponentOptionsModel){
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }


  addFieldGroupItem(selectedField:SelectableFieldItemModel){
    const formFieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectedField)
    this.formEditorService.addFormItemToFieldGroup(this.fieldItem, formFieldItem);
  }

  addFieldGridItem(selectedField:SelectableFieldItemModel){
    const formFieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectedField)
    // this.formEditorService.addFormItemToFieldGroup(this.fieldItem, formFieldItem);
    console.log(formFieldItem)
  }

  onFieldGroupUpdated(fieldGroup:FieldItemModel[]){
    console.log(fieldGroup)
    this.fieldItem = {
      ...this.fieldItem,
      fieldGroup
    }
    console.log(this.fieldItem)
    this.formEditorService.updateFormItem(this.fieldItem)
  }
  // onGridUpdated(options:OptionModel[]){
  // }

  stopButtonEvent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  onOrderUp(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.fieldItem.uuid, OrdinalDirectionEnum.UP, this.treeItem.parentKey);
  }
  onOrderDown(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.fieldItem.uuid, OrdinalDirectionEnum.DOWN, this.treeItem.parentKey);
  }
  onDuplicate(event){
    this.stopButtonEvent(event);
    this.formEditorService.duplicateFormItem(this.fieldItem.uuid, this.treeItem.parentKey)
  }
  onUser(event){
    this.stopButtonEvent(event);
  }
  onDelete(event){
    this.stopButtonEvent(event);
    this.formEditorService.deleteFormItem(this.fieldItem.uuid, this.treeItem.parentKey);
  }



  destroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
