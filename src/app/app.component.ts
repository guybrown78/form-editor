import { Component, OnInit } from '@angular/core';
import { AppHeaderService, AppNavigationService, AppNavigationItem } from 'tf-ng-nz';

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


// https://xd.adobe.com/view/0a077198-1588-4c4f-aba5-b1a13caa4fde-5f54/screen/6921a962-d6cc-4cc4-ab06-571c99282869
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Form Editor';
  appReady:boolean = false;
  hideHeader:boolean = true;
  constructor(
    private appHeaderService: AppHeaderService,
    private appNavigationService: AppNavigationService,
  ) {
    //
  }

  ngOnInit() {
    this.appNavigationService.navigationData = navigationData;
    this.appNavigationService.navigationDataLoaded = true;
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
    this.appReady = true;
  }

}
