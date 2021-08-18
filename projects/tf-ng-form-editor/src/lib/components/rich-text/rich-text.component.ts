import { Component, SecurityContext, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

enum FroalaEventAction{
  FroalaFocus  = 'INTERNAL_FROALA_FOCUS',
  FroalaBlur  = 'INTERNAL_FROALA_BLUR',
  FroalaChange = 'INTERNAL_FROALA_CHANGE',
}


@Component({
  selector: 'form-editor-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.css']
})
export class RichTextComponent{

  froalaContent:string;

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

  @Output('encodedRichText') encodedRichText = new EventEmitter<string>();

  constructor(
    private sanitizer: DomSanitizer,
  ) { }


  onFroalaEvent(eventType:FroalaEventAction, event:any){
    if(eventType === FroalaEventAction.FroalaChange){
      this.sanitizeRichText(this.froalaContent);
      // console.log(this.encodedContent);
      // console.log(decodeURIComponent(this.encodedContent))
      this.encodedRichText.emit(this.encodedContent);
    }
  }

  sanitizeRichText(str:string){
    const sanitized = this.sanitizer.sanitize(SecurityContext.HTML, str);
    this.encodedContent = encodeURIComponent(sanitized);
  }

  decodeRichText(str){
    return decodeURIComponent(str)
  }

}
