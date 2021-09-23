import { Component, OnDestroy, OnInit } from '@angular/core';
import { TfNgFormService, TfNgFormPermissionService } from 'tf-ng-form';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit, OnDestroy {


  submittedSubscription:Subscription;

  constructor(
    private formService:TfNgFormService,
    private formPermissionService:TfNgFormPermissionService,
  ) { }

  ngOnInit(): void {

		// Not sure why this is set in the class https://bitbucket.org/aisneutron/transform.formbuilder/src/TRAN-1341_August/Transform.FormBuilder.Client/src/app/admin/registrations/view-registration/view-registration.component.ts

		// disableForm shouldn't be used in this scenario. formPermissionsService.formReadOnly is the param that should be set as this just stops all elements from being filled in, but still allows steppers/tabs/sections to be interacted with

		// if you do need to set this, revert it back in the destory methos

		// this.formService.disableForm = true;

    this.formPermissionService.formReadOnly = true;
    const url = 'assets/forms/review.json'
    this.formService.getData(url).subscribe(data => {
      // data has loaded, the formService getData parses the data before it is returned here and stores the formFields, model and meta for the form.
    }, err => {
      // if the data can't load, then make the UI nice and show the user
      console.log("error loading data in controllong app")
      console.log(err);
    })
  }


  ngOnDestroy():void {
    this.formPermissionService.formReadOnly = false;
		//
		// revert this back if you use it
		// this.formService.disableForm = false;

  }

}
