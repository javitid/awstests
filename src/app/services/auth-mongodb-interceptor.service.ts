import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMongoDBInterceptorService implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private http: HttpClient
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const headers = req.headers.set(
      'Authorization',
      this.authService.getToken()
    );
    return next.handle(req.clone({ headers }));
  }
}
