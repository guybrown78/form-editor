import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { OptionModel } from '../../../to-share/field-item-component-options-model.interface'


@Component({
  selector: 'form-editor-field-item-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {

  @Output('updated') updated = new EventEmitter<OptionModel[]>()

  private _optionItems: OptionModel[] = [];
  @Input() set optionItems(values:OptionModel[]){
    if(values){
      this._optionItems = [ ...values ]
    }
  }
  // get optionItems():OptionModel[]{
  //   return this._optionItems;
  // }

  form: FormGroup;


  constructor(
    private fb:FormBuilder
  ) {

  }

  ngOnInit() {
    this.initForm();
    this.onChanges();
  }


  initForm(){
    const opts = [];
    this._optionItems.map((opt, i) => {
      opts.push(this.createOptionFormGroup(opt.label));
    })
    this.form = this.fb.group({
      options: this.fb.array([ ...opts ])
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe((val) => {
      this.updated.emit(this.form.value.options)
    });
  }

  get options() {
    return this.form.get('options') as FormArray;
  }

  addItem(label:string = null) {
    const options = this.form.get('options') as FormArray;
    options.push(this.createOptionFormGroup(label))
  }

  createOptionFormGroup(label:string = null){
    const fg:FormGroup = this.fb.group({
      label: label,
      value: label
    });
    fg.controls['label'].valueChanges.subscribe(val => {
      fg.controls['value'].setValue(val);
    })
    return fg;
  }

  removeItem(index:number) {
    const options = this.form.get('options') as FormArray;
    options.removeAt(index);
  }


}
