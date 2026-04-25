import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

const URL_BEARER_TOKEN = 'https://eu-west-2.aws.realm.mongodb.com/api/client/v2.0/app/data-iuwtk/auth/providers/api-key/login';

@Injectable()
export class AuthMongoDBGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private http: HttpClient
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    void _route;
    void _state;
    const requestBody = { key: environment.mongoDBApiKey };

    if (this.authService.getToken()) {
      return of(true);
    }

    return this.http.post<{ access_token: string }>(URL_BEARER_TOKEN, requestBody).pipe(
      shareReplay(1),
      map((tokenBearer) => {
        this.authService.saveToken('Bearer ' + tokenBearer.access_token);
        return !!tokenBearer;
      })
    );
  }
}
