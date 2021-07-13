import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent{

  @Input('statsData') appStatsData:any[] = [
		{
			status:"red",
			title:"Not Started",
			data:"1"
		},
		{
			status:"amber",
			title:"In Progress",
			data:"19"
		},
		{
			status:"green",
			title:"Completed",
			data:"22"
		}
	];
}
