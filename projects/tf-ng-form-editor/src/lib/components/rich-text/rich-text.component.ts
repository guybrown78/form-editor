import { Component, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { TfNgFormEditorService } from '../../tf-ng-form-editor.service';

enum FroalaEventAction{
  FroalaFocus  = 'INTERNAL_FROALA_FOCUS',
  FroalaBlur  = 'INTERNAL_FROALA_BLUR',
  FroalaChange = 'INTERNAL_FROALA_CHANGE',
}

const isHTML = (str) => !(str || '')
  // replace html tag with content
  .replace(/<([^>]+?)([^>]*?)>(.*?)<\/\1>/ig, '')
  // remove remaining self closing tags
  .replace(/(<([^>]+)>)/ig, '')
  // remove extra space at start and end
  .trim();
@Component({
  selector: 'form-editor-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css']
})
export class RichTextComponent{

  froalaContent:string;
  froalaKey:string;

  froalaOptions: Object = {
    placeholderText: 'Start typing your rich text...',
    charCounterCount: false,
    events : {
      'focus' : (e) => this.onFroalaEvent(FroalaEventAction.FroalaFocus, e),
      'blur' : (e) => this.onFroalaEvent(FroalaEventAction.FroalaBlur, e),
      'contentChanged' : (e) => this.onFroalaEvent(FroalaEventAction.FroalaChange, e),
    }
  }

  encodedContent:string;

  @Input('passedFormControlName') passedFormControlName:string;

  @Input('title') title:string;

  private _passedFormControl:FormControl
  @Input('passedFormControl') set passedFormControl(control:FormControl){
    this._passedFormControl = control;

    const decodedValue = decodeURIComponent(control.value);
    if(isHTML(decodedValue)){
      this.froalaContent = decodedValue;
      this.isDynamic = true;
    }else{
      this.isDynamic = false;
    }
    this.ready = true;
  }
  get passedFormControl():FormControl{
    return this._passedFormControl;

  }

  @Input('rowCount') rowCount:number = 1;

  // @Output('encodedRichText') encodedRichText = new EventEmitter<string>();

  private _isDynamic:boolean = false;
  set isDynamic(value:boolean){
    let decodedValue = decodeURIComponent(this.passedFormControl.value);
    if(decodedValue == "null"){
      decodedValue = "";
    }
    if(value){
      // add message to text;
      this.froalaContent = decodedValue;
    }else{
      if(this.froalaContent){
        const div = document.createElement("div");
        div.innerHTML = decodedValue;
        const text = div.textContent || div.innerText || "";
        this.passedFormControl.setValue(text)
      }
    }
    this._isDynamic = value;
  }
  get isDynamic():boolean{
    return this._isDynamic;
  }


  ready:boolean = false;


  constructor(
    private sanitizer: DomSanitizer,
    private formEditorService:TfNgFormEditorService
  ) {
    this.froalaKey = formEditorService.froalaKey;
    this.froalaOptions['key'] = this.froalaKey;
  }


  onFroalaEvent(eventType:FroalaEventAction, event:any){
    if(eventType === FroalaEventAction.FroalaChange){
      this.sanitizeRichText(this.froalaContent);
      this.passedFormControl.setValue(this.encodedContent)
    }
  }

  sanitizeRichText(str:string){
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, str);
    this.encodedContent = encodeURIComponent(sanitized);
  }

  decodeRichText(str){
    return decodeURIComponent(str)
  }

  onToggleEditMode(){
    this.isDynamic = !this.isDynamic;
  }
}
