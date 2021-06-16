import { Component, OnInit } from '@angular/core';
import { TfNgFormService, TfNgFormPermissionService, DisplayJsonService } from 'tf-ng-form';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-preview-form',
  templateUrl: './preview-form.component.html',
  styleUrls: ['./preview-form.component.css']
})
export class PreviewFormComponent implements OnInit {

  submittedSubscription:Subscription;

  constructor(
    private formService:TfNgFormService,
    private displayJsonService:DisplayJsonService,
  ) { }

  ngOnInit(): void {
    //
    this.formService.getData('assets/forms/engineeringServiceLineCAF.json').subscribe(data => {
      // data has loaded, the formService getData parses the data before it is returned here and stores the formFields, model and meta for the form.
      // only thing left to do is listen for the submit button to be pressed
      this.submittedSubscription = this.formService.submitted.subscribe(
        submittedJSON => {
          this.onFormSubmitted(submittedJSON);
        }
      )
    }, err => {
      // if the data can't load, then make the UI nice and show the user
      console.log("error loading data in controllong app")
      console.log(err);
    })
  }

  onFormSubmitted(json:string){
    console.log(json)
    // for dev purposes, display the json nicely
    this.displayJsonService.show(json, 'Dedault Data');
  }

  ngOnDestroy():void {
    // clean up the on submit listener
    if(this.submittedSubscription){
      this.submittedSubscription.unsubscribe();
    }
  }

}
