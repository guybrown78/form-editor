import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormEditorConfigService, SelectableFieldItemModel, SelectableCategory } from '../../form-editor-config.service';
import { FieldItemModel } from '../../to-share/field-item-model.interface';


@Component({
  selector: 'form-editor-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.css']
})
export class NavigationItemComponent {


  private _item:SelectableFieldItemModel
  @Input('item') set item(value:SelectableFieldItemModel){
    this._item = value;
  }
  get item():SelectableFieldItemModel{
    return this._item
  }

  mouseIn:boolean = false;

  constructor() { }

  onMouseOver(){
    this.mouseIn = true;
  }
  onMouseOut(){
    this.mouseIn = false;
  }

}
