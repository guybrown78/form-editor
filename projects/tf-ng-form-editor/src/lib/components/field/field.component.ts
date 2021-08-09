import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  FormEditorConfigService,
  SelectableFieldItemModel,
  EditorItemModel
} from '../../form-editor-config.service';
import {
  FormTreeModel,
  OrdinalDirectionEnum,
  TfNgFormEditorService
} from '../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';


interface TabItemModel {
  label:string
  value:string
  disabled:boolean
}
@Component({
  selector: 'form-editor-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit, OnDestroy {

  selectedKeySubscription:Subscription

  fieldItem:FieldItemModel
  selectableItem:SelectableFieldItemModel
  editorItemModel:EditorItemModel;

  // form: FormGroup;
  // optionsForm: FormGroup;

  treeItem:FormTreeModel

  availableTabs:TabItemModel[] = []
  tabIndex:number;

  formReady = false;

  constructor(
    private formEditorService:TfNgFormEditorService,
    private formEditorConfig:FormEditorConfigService
  ) { }

  ngOnInit(): void {
    this.initialiseFormSubscription()
  }

  initialiseFormSubscription(){
    this.selectedKeySubscription = this.formEditorService.selectedTreeKey.subscribe(key => {

      if(key){
        this.fieldItem = null;
        this.selectableItem = null;

        this.formEditorService.getFieldItemFromTreeKey(key).pipe(take(1)).subscribe(

          item => {

            if(item){


              // set the fieldItem (field specific model for preview)
              this.fieldItem = item;

              // force a pause to allow the tree data to be built as the selected key firest before the treeData build. TODO - maybe emit the selected key on tree success in the service?

              setTimeout(() => {

                // when item has been inited get config data...
              this.formEditorService.getTreeItemFromKey(item.uuid).pipe(take(1)).subscribe(treeItem => {

                if(treeItem){


                  this.treeItem = treeItem;

                  // when item has been inited get config data...
                  this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
                    if(selectableItem){

                      this.selectableItem = selectableItem;

                      this.editorItemModel = {
                        fieldItem: this.fieldItem,
                        selectableItem: this.selectableItem
                      }

                      this.initTabNavigation()

                    }else{
                      this.selectableItem = null;
                    }
                  })

                }
              })



              }, 100)


            }else{
              this.selectableItem = null;
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


  onUpdatedFieldItem(fieldItem:FieldItemModel){
    this.fieldItem = { ...fieldItem };
    this.editorItemModel = {
      fieldItem: this.fieldItem,
      selectableItem: this.selectableItem
    }
  }

  initTabNavigation(){
    this.availableTabs = []
    this.tabIndex = 0;

    // always allow the Editor initial tab
    this.availableTabs.push({
      label:"Editor",
      value:"editor",
      disabled:false
    })
    if(
      this.selectableItem.editableConfig.hasLayoutOptions ||
      this.selectableItem.editableConfig.hasGridOptions
    ){
      this.availableTabs.push({
        label:"Layout",
        value:"layout",
        disabled:false
      })
    }
    // set the available tabs based of config
    if(
      this.selectableItem.editableConfig.setRequired ||
      this.selectableItem.editableConfig.setPermissions ||
      this.selectableItem.editableConfig.setHelp
    ){
      this.availableTabs.push({
        label:"Options",
        value:"options",
        disabled:false
      })
    }
  }

  ngOnDestroy(){
    this.selectedKeySubscription.unsubscribe
  }

}
