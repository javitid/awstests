import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PATH } from './config/constants';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PATH.DASHBOARD
      },
      {
        path: PATH.DASHBOARD,
        component: DashboardComponent,
        data: {animation: 'isLeft'}
      },
      {
        path: PATH.SETTINGS,
        component: SettingsComponent,
        data: {animation: 'isRight'}
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
