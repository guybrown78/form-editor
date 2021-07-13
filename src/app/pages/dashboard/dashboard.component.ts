import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  listOfData = [
    {
      key: '1',
      name: 'Form example',
      code: 'f_001',
      status: 'Published'
    },

  ];

}
