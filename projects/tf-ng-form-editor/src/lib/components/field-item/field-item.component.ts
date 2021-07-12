import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel } from '../../form-editor-config.service';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemComponentOptionsModel, OptionModel } from '../../to-share/field-item-component-options-model.interface';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

@Component({
  selector: 'form-editor-field-item',
  templateUrl: './field-item.component.html',
  styleUrls: ['./field-item.component.css']
})
export class FieldItemComponent implements OnInit {

  @Input('key') key:string;

  // selectedKeySubscription:Subscription
  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel

  form: FormGroup;
  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.initialiseFormSubscription()
  }

  initialiseFormSubscription(){
    // this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {
      if(this.key){
        this.formEditorService.getFieldItemFromTreeKey(this.key).subscribe(
          item => {

            if(item){
              this.fieldItem = item;
              // when item has been inited get config data...
              this.formEditorConfig.getSelectableItemFromType(this.fieldItem.type).pipe(take(1)).subscribe(selectableItem => {
                if(selectableItem){
                  this.selectableItem = selectableItem;
                  this.initForm();
                }else{
                  this.selectableItem = null;
                }
              })
            }

          }
        )
      }else{
        this.fieldItem = null;
        this.selectableItem = null;
      }
    // })
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
    this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = { ...this.fieldItem, ...this.form.value}
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }


  onOptionsUpdated(options:OptionModel[]){
    const componentOptions:FieldItemComponentOptionsModel = {
      ...this.fieldItem.componentOptions,
      options
    }
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }

  destroy(){
    // this.selectedKeySubscription.unsubscribe
  }

}
