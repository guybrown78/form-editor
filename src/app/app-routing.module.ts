import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditFormComponent } from './pages/edit-form/edit-form.component';
import { PreviewFormComponent } from './pages/preview-form/preview-form.component';
const routes: Routes = [

  { path:"dashboard", component:DashboardComponent, data:{}},
  { path:"create", component:CreateFormComponent, data:{}},
  { path:"edit", component:EditFormComponent, data:{}},
  { path:"preview", component:PreviewFormComponent, data:{}},
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
