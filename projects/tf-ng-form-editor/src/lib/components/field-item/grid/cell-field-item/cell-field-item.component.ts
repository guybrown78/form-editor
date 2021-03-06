import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory, EditorItemModel } from '../../../../form-editor-config.service';
import { TfNgFormEditorService } from '../../../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../../../to-share/field-item-model.interface';
import { take } from 'rxjs/operators';

import {
  FieldItemComponentOptionsModel,
  OptionModel,
  FieldItemGridOptionsModel
} from '../../../../to-share/field-item-component-options-model.interface';
import { TabItemModel } from '../../../field/field.component';

@Component({
  selector: 'form-editor-cell-field-item',
  templateUrl: './cell-field-item.component.html',
  styleUrls: ['./cell-field-item.component.css']
})
export class CellFieldItemComponent implements OnInit {


   // accept FieldItem
   private _selectableItem:SelectableFieldItemModel
   set selectableItem(model:SelectableFieldItemModel){
     this._selectableItem = model;
   }
   get selectableItem():SelectableFieldItemModel{
     return this._selectableItem;
   }

  private _fieldItem:FieldItemModel
  @Input('fieldItem') set fieldItem(item:FieldItemModel){

    if(this.fieldItem && this.fieldItem.uuid === item.uuid){
      this._fieldItem = item;
      return
    }
    // get selectable item
    this.formEditorConfig.getSelectableItemFromType(item.type).pipe(take(1)).subscribe(selectableItem => {
      if(selectableItem){


        this.selectableItem = selectableItem;
        //
        this._fieldItem = item;
        this.editorItemModel = {
          fieldItem: this.fieldItem,
          selectableItem: this.selectableItem
        }
        this.initTabNavigation()
        //
        this.formReady = true;
        //
      }
    }, err => {
      console.log("err")
    })


  }
  get fieldItem():FieldItemModel{
    return this._fieldItem
  }

  editorItemModel:EditorItemModel


  form: FormGroup;
  formReady:boolean = false;

  availableTabs:TabItemModel[] = [];
  tabIndex:number;


  constructor(
    private fb:FormBuilder,
    private formEditorConfig:FormEditorConfigService,
    private formEditorService:TfNgFormEditorService,
  ) { }

  ngOnInit(): void {
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
    if(
      this.selectableItem.editableConfig.hasGridOptions
    ){
      this.availableTabs.push({
        label:"Grid Layout",
        value:"layout",
        disabled:false
      })
    }
    if(!this.selectableItem.editableConfig.disableEdit){
      this.availableTabs.push({
        label:"Editor",
        value:"editor",
        disabled:false
      })
    }
    if(
      this.selectableItem.editableConfig.hasLayoutOptions
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
      this.selectableItem.editableConfig.setHelp ||
      this.selectableItem.editableConfig.hasDateOptions
    ){
      this.availableTabs.push({
        label:"Options",
        value:"options",
        disabled:false
      })
    }
    if(
      this.selectableItem.editableConfig.setPermissions ||
      this.selectableItem.editableConfig.setReadonlyPermissions
    ){
      this.availableTabs.push({
        label:"Permissions",
        value:"permissions",
        disabled:false
      })
    }
  }


  onSelectedTabIndexChange(index){
    this.tabIndex = index;
  }


}
