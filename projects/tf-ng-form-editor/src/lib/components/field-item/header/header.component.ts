import { Component, Input, OnInit } from '@angular/core';
import { FormTreeModel } from '../../../tf-ng-form-editor.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { TfNgFormEditorService, OrdinalDirection } from '../../../tf-ng-form-editor.service';
import { FieldItemModel } from '../../../to-share/field-item-model.interface';

@Component({
  selector: 'form-editor-field-item-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input('node') node:FormTreeModel;
  @Input('isOpen') isOpen:boolean;

  constructor(
    private formEditorService:TfNgFormEditorService
  ) { }

  ngOnInit(): void {
  }
  stopButtonEvent(event){
    event.preventDefault();
    event.stopPropagation();
  }

  onOrderUp(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.node.key, OrdinalDirection.UP);
  }
  onOrderDown(event){
    this.stopButtonEvent(event);
    this.formEditorService.updateFormItemOrdinal(this.node.key, OrdinalDirection.DOWN);
  }
  onDuplicate(event){
    this.stopButtonEvent(event);
    this.formEditorService.duplicateFormItem(this.node.key);
  }
  onUser(event){
    this.stopButtonEvent(event);
  }
  onDelete(event){
    this.stopButtonEvent(event);
    this.formEditorService.deleteFormItem(this.node.key);
  }


}
