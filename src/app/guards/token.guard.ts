import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    void _route;
    void _state;
    return this.authService.isAuthenticated$().pipe(take(1));
  }
}
