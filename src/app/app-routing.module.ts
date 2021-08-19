import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateFormComponent } from './pages/create-form/create-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EditFormComponent } from './pages/edit-form/edit-form.component';
import { PreviewFormComponent } from './pages/preview-form/preview-form.component';
import { CanDeactivateGuard } from 'projects/tf-ng-form-editor/src/public-api';
// import { CanDeactivateGuard} from 'tf-ng-form-editor'
const routes: Routes = [

  { path:"dashboard", component:DashboardComponent, data:{}},
  {
    path:"create",
    component:CreateFormComponent,
    data:{},
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path:"edit",
    component:EditFormComponent,
    data:{},
    canDeactivate: [CanDeactivateGuard]
  },
  { path:"preview", component:PreviewFormComponent, data:{}},
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
