import { Component, OnDestroy, OnInit } from '@angular/core';
import { TfNgFormService, TfNgFormPermissionService, DisplayJsonService } from 'tf-ng-form';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {


  submittedSubscription:Subscription;

  constructor(
    private formService:TfNgFormService,
    private formPermissionService:TfNgFormPermissionService,
    private displayJsonService:DisplayJsonService,
  ) { }

  ngOnInit(): void {
    //

    this.formPermissionService.formReadOnly = true;
    const url = 'assets/forms/review.json'
    // const url = 'assets/forms/TraineeCADOperator_Americas.json'
    this.formService.getData(url).subscribe(data => {
      // data has loaded, the formService getData parses the data before it is returned here and stores the formFields, model and meta for the form.
      // only thing left to do is listen for the submit button to be pressed
      // this.submittedSubscription = this.formService.submitted.subscribe(
      //   submittedJSON => {
      //     this.onFormSubmitted(submittedJSON);
      //   }
      // )
    }, err => {
      // if the data can't load, then make the UI nice and show the user
      console.log("error loading data in controllong app")
      console.log(err);
    })
  }

  // onFormSubmitted(json:string){
  //   console.log(json)
  //   // for dev purposes, display the json nicely
  //   this.displayJsonService.show(json, 'Dedault Data');
  // }

  ngOnDestroy():void {
    this.formPermissionService.formReadOnly = false;
    // clean up the on submit listener
    // if(this.submittedSubscription){
    //   this.submittedSubscription.unsubscribe();
    // }
  }

}
