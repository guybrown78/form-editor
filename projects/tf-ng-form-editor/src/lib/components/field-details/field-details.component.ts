import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';
import { FieldItemComponentOptionsModel, OptionModel } from '../../to-share/field-item-component-options-model.interface';

@Component({
  selector: 'form-editor-field-details',
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.css']
})
export class FieldDetailsComponent implements OnInit {

  selectedKeySubscription:Subscription
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
    this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {
      if(key){
        this.fieldItem = null;
        this.selectableItem = null;
        this.formEditorService.getFieldItemFromTreeKey(key).subscribe(
          item => {
            if(item){
              this.fieldItem = item;
              // when item has been inited get config data...

              this.formEditorConfig.getSelectableItemFromType(item.type).subscribe(selectableItem => {
                  if(selectableItem){
                    this.selectableItem = selectableItem;
                    this.initForm();
                  }else{
                    this.selectableItem = null;
                  }
                })
              // if(!this.selectableItem){
                // this.initialiseItemConfigData()
              // }
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

  initialiseItemConfigData(){
    // when item has been inited get config data from 'type'...
    this.formEditorConfig.getSelectableItemFromType(this.fieldItem.type).pipe(take(1)).subscribe(selectableItem => {

     if(selectableItem){
       this.selectableItem = { ...selectableItem};
       this.initForm();
     }else{
       this.selectableItem = null;
     }
   })
 }

  initForm(): void {
    this.form = this.fb.group({});
    // setRequired
    if(this.selectableItem.editableConfig.setRequired){
      this.form.addControl(
        'required',
        new FormControl(this.fieldItem.required, [])
      );
    }
    // setPermissions
    if(this.selectableItem.editableConfig.setPermissions){
      this.form.addControl(
        'permissions',
        new FormControl(this.fieldItem.permissions, [])
      );
    }
    // setReadonlyPermissions
    // help
    if(this.selectableItem.editableConfig.setHelp){
      this.form.addControl(
        'help',
        new FormControl(this.fieldItem.help, [])
      );
    }
    //
    // hasLayoutOptions
    if(this.selectableItem.editableConfig.hasLayoutOptions){
      this.form.addControl(
        'layout',
        new FormControl(this.fieldItem, [])
      );
    }
    if(this.showDetailsComponentOptions()){
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


  onComponentOptionsUpdated(cmpOptions:FieldItemComponentOptionsModel){
    const componentOptions:FieldItemComponentOptionsModel = {
      ...this.fieldItem.componentOptions,
      ...cmpOptions
    }
    this.fieldItem = {
      ...this.fieldItem,
      componentOptions
    }
    this.formEditorService.updateFormItem(this.fieldItem)
  }

  showDetailsComponentOptions():boolean{
    let show:boolean = false;
    if(!this.selectableItem){
      return show;
    }
    if(
      this.selectableItem.editableConfig.hasLayoutOptions ||
      this.selectableItem.editableConfig.hasGridOptions
    ){
      show = true;
    }
    return show
  }

  destroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
