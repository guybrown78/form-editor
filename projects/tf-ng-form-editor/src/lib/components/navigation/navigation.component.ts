import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FieldItemModel } from '../../to-share/field-item-model.interface';

import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';
import { SelectableFieldItemModel } from '../../form-editor-config.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'form-editor-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})

export class NavigationComponent implements OnInit {

  private _disabled:boolean = false;
  @Input('disabled') set disabled(value:boolean){
    if(value){
      this.closeAll();
    }
    this._disabled = value;
  }
  get disabled():boolean{
    return this._disabled;
  }

  private _hasTabs:boolean = false;
  @Input('hasTabs') set hasTabs(value:boolean){
    if(value){
      this.closeAll();
    }
    this._hasTabs = value;
  }
  get hasTabs():boolean{
    return this._hasTabs;
  }

  @Input('hasFormSchema') hasFormSchema:boolean = false;

  @Input('hide') hide:boolean = false;
  @Input('hideNavigation') hideNavigation:boolean = false;
  @Input('animateHideToggles') animateHideToggles:boolean = true;

  isMobile:boolean = true;
  isCollapsed = true;
  currentMenuType:string;
  currentMenuColour:string = "blue";
  sideBarIsActive = false;
  drawIsActive = false;
  //

  // TODO, remove booleans for wach item and just have a current selctect item (move booleans to array maybe and set by index?)
  anyMenuVisable:boolean = false;
  layoutMenuVisible:boolean = false;
  complexMenuVisible:boolean = false;
  singleMenuVisible:boolean = false;
  formMenuVisible:boolean = false;


  // TODO, move this to config - at the moment relies too much on the 4 booleans above
  navigationItems:any[] = [
    {label:"Layout menu", type:"layout-menu", icon:"edit"},
    {label:"Single Item menu", type:"single-menu", icon:"export"},
    {label:"Complex menu", type:"complex-menu", icon:"appstore"},
    {label:"Form menu", type:"form-menu", icon:"form"}
  ]

  constructor(
    private formEditorService:TfNgFormEditorService,
    private modal: NzModalService,
  ) { }

  ngOnInit(): void {
  }


  onToggleDrawer(menu:string){
    if(this.disabled){
      return
    }
    switch(menu){
      case "layout-menu":
        if(this.hasTabs){
          return
        }
        this.anyMenuVisable = this.layoutMenuVisible = !this.layoutMenuVisible
        this.complexMenuVisible = false;
        this.singleMenuVisible = false;
        this.formMenuVisible = false;
        break;
      case "complex-menu":
        if(this.hasTabs){
          return
        }
        this.layoutMenuVisible = false;
        this.anyMenuVisable = this.complexMenuVisible = !this.complexMenuVisible;
        this.singleMenuVisible = false;
        this.formMenuVisible = false;
        break;
      case "single-menu":
        if(this.hasTabs){
          return
        }
        this.layoutMenuVisible = false;
        this.complexMenuVisible = false;
        this.anyMenuVisable = this.singleMenuVisible = !this.singleMenuVisible;
        this.formMenuVisible = false;
        break;
      case "form-menu":
        this.layoutMenuVisible = false;
        this.complexMenuVisible = false;
        this.singleMenuVisible = false;
        this.anyMenuVisable = this.formMenuVisible = !this.formMenuVisible;
        break;
    }
  }

  getHexMenuColour(menu:string){
    switch(menu){
      case "layout-menu":
        return {
          hex:this.layoutMenuVisible ? 'white' : 'blue',
          icon:this.layoutMenuVisible ? 'blue' : 'white'
        }
      case "complex-menu":
        return {
          hex:this.complexMenuVisible ? 'white' : 'blue',
          icon:this.complexMenuVisible ? 'blue' : 'white'
        }
      case "single-menu":
        return {
          hex:this.singleMenuVisible ? 'white' : 'blue',
          icon:this.singleMenuVisible ? 'blue' : 'white'
        }
      case "form-menu":
        return {
          hex:this.formMenuVisible ? 'white' : 'blue',
          icon:this.formMenuVisible ? 'blue' : 'white'
        }
    }
  }

  getMenuDrawerStateClass(menu:string){
    switch(menu){
      case "layout-menu":
        return this.layoutMenuVisible ? 'show' : 'hide'
      case "complex-menu":
        return this.complexMenuVisible ? 'show' : 'hide'
      case "single-menu":
        return this.singleMenuVisible ? 'show' : 'hide'
      case "form-menu":
        return this.formMenuVisible ? 'show' : 'hide'
    }
  }

  closeAll(){
    this.layoutMenuVisible = false;
    this.complexMenuVisible = false;
    this.singleMenuVisible = false;
    this.formMenuVisible = false;
    this.anyMenuVisable = false;
  }


  getIsDisabled(menu:string){
    if(this.disabled){
      return true;
    }
    if(this.hasTabs && menu !== "form-menu"){
      return true;
    }
    return false
  }
  onSelectedField(selectedField:SelectableFieldItemModel): void {
    const formFieldItem:FieldItemModel = this.formEditorService.getFieldItemFromSelection(selectedField)
    //
    if(formFieldItem.type === 'tabs'){
      this.formEditorService.form.pipe(take(1)).subscribe(form => {
        if(form){
          this.modal.confirm({
            nzTitle: '<b>Adding sections</b>',
            nzContent: `
              <p>Adding section tabs to a form changes the form structure. Every field within the form will have to be placed into a section tab.</p>
              ${form.schema.length > 0 ? '<p><b>The fields you have added already will be placed into the first tab</b></p>' : ''}
            `,
            nzOnOk: () => {
              this.formEditorService.addTabsFormItem(formFieldItem);
              this.closeAll();
            }
          });
        }
      })
    }else{
      this.addFormItem(formFieldItem)
    }

   }


   addFormItem(formFieldItem:FieldItemModel){
    this.formEditorService.addFormItem(formFieldItem);
    this.closeAll();
   }
}
