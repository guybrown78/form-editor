import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

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
        this.formEditorService.getFieldItemFromTreeKey(key).subscribe(
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

    this.onChanges();

  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.fieldItem = { ...this.fieldItem, ...this.form.value}
      this.formEditorService.updateFormItem(this.fieldItem)
    });
  }

  destroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
