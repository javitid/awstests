import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PATH } from './config/constants';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
// import { AuthMongoDBGuard } from './guards/auth-mongodb.guard';
import { TokenGuard } from './guards/token.guard';

const routes: Routes = [
  {
    path: '',
    // Only it's needed to get a Bearer token if the login auth is not implemented, other case the token is retrieved in the login service response
    // canActivate: [AuthMongoDBGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PATH.LOGIN
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
        data: {animation: 'isLeft'},
        canActivate: [TokenGuard]
      },
      {
        path: PATH.SETTINGS,
        component: SettingsComponent,
        data: {animation: 'isRight'},
        canActivate: [TokenGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
