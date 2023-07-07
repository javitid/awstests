import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PATH } from './config/constants';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

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
        path: PATH.LOGIN,
        component: LoginComponent
      },
      {
        path: PATH.LOGOUT,
        component: LogoutComponent
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
