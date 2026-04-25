import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { PATH } from 'src/app/config/constants';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private readonly service: AuthService,
    private readonly router: Router
  ) {
  }

  public async logout(): Promise<void> {
    await this.service.signOutExternal();
    await this.router.navigate([PATH.LOGIN]);
  }
}
