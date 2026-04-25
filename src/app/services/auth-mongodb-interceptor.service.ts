/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { PATH } from '../config/constants';

@Injectable()
export class AuthMongoDBInterceptorService implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const headers = req.headers.set('Authorization', this.authService.getToken());
    return next.handle(req.clone({ headers })).pipe(
      catchError((event: any) => {
        if(event.status === 401) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Sesion expirada',
            detail: 'Authentication token expired. Recarga la pagina si lo necesitas.',
            life: 10000,
          });

          // Clear Bearer and redirect to login screen
          this.authService.saveToken('');
          this.router.navigate([PATH.LOGIN]);
        }
        return throwError(event);
      })
    );
  }
}
