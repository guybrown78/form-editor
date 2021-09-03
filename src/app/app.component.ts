import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppHeaderService, AppNavigationService, AppNavigationItem } from 'tf-ng-nz';
import { TfNgFormPermissionService, TfNgFormPermissionInterface } from 'tf-ng-form';
import { TfNgFormEditorService } from 'projects/tf-ng-form-editor/src/public-api';
import { environment } from 'src/environments/environment';

const navigationData:AppNavigationItem[] = [
  {
    routerLink:"/dashboard",
    hasSub:false,
    label:"Dashboard"
  },
  {
    routerLink:"/create",
    hasSub:false,
    label:"Create new form"
  },
  {
    label:"Existing forms",
    hasSub:true,
    subItems:[
      {
        routerLink:"/edit",
        hasSub:false,
        label:"Edit existing form"
      },
      {
        routerLink:"/preview",
        hasSub:false,
        label:"Preview existing form"
      }
    ]
  }
]

// permissions
/*
The tennants permission structure (in this example WOOD). This is used to set up the permissions within the form preview lib (tf-ng-form).

  If used;
  - The list is exposed to the form editor and the read/write permissions can be set for each form item.
  - The current user's permissions/level can be set in the preview

*/
const tenantsFormPermissions:TfNgFormPermissionInterface[] = [
  { label:"Delegate", level:0 },
  { label:"Accessor", level:1 },
  { label:"Verifier", level:2 },
  { label:"IQA", level:3 }
]

// https://xd.adobe.com/view/0a077198-1588-4c4f-aba5-b1a13caa4fde-5f54/screen/6921a962-d6cc-4cc4-ab06-571c99282869

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Form Editor';
  appReady:boolean = false;

  currentRoute:string = "";
  hideHeader:boolean = false;

  constructor(
    private appHeaderService: AppHeaderService,
    private appNavigationService: AppNavigationService,
    private router:Router,
    private formPermissionService:TfNgFormPermissionService,
    private formEditorService:TfNgFormEditorService
  ) {
    //
    formEditorService.froalaKey = environment.froalaKey;
    //
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        this.currentRoute = val.url;
        switch(this.currentRoute){
          case "/create":
          case "/edit":
          case "/preview":
            this.hideHeader = true;
            break;
          default:
            this.hideHeader = false;
            break;
        }
      }
    });
  }

  ngOnInit() {
    this.appNavigationService.navigationData = navigationData;
    this.appNavigationService.navigationDataLoaded = true;
    //
    // this.appNavigationService
    //
    this.appHeaderService.setOptions({
      appCode: 'fb',
      appTitle: this.title,
      clientLogoSource:
        'https://www.woodplc.com/__data/assets/git_bridge/0030/134958/dist/mysource_files/wood-footer-logo.svg',
      userAccountIcon: 'logout',
      showUserDropdown: false,
    });
    //
    // listen and handle confirmed signout from header modal
    this.appHeaderService.signoutConfirmed.subscribe(
      confirmed => {
        console.log("Sign out confirmed, tell identity")
      }
    );
    //
    // Set this gloabally within the app for the loaded tennant according to the tennants structure... TODO, can make this configerable
    this.formPermissionService.setUserPermissions([ ...tenantsFormPermissions ])
    //
    this.appReady = true;
  }


}
