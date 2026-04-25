import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

const SESSION_STORAGE_KEY = 'mongoDataToken';

@Injectable({
  providedIn: 'root',
})
export class MongoDataAuthService {
  private tokenRequest$?: Observable<string>;

  constructor(private readonly httpClient: HttpClient) {}

  getToken(): Observable<string> {
    const storedToken = sessionStorage.getItem(SESSION_STORAGE_KEY);

    if (storedToken) {
      return of(storedToken);
    }

    if (!this.tokenRequest$) {
      this.tokenRequest$ = this.httpClient
        .post<{ access_token: string }>(environment.urlBearerToken, {
          key: environment.mongoDBApiKey,
        })
        .pipe(
          map((response) => `Bearer ${response.access_token}`),
          tap((token) => sessionStorage.setItem(SESSION_STORAGE_KEY, token)),
          shareReplay(1)
        );
    }

    return this.tokenRequest$;
  }

  clearToken(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    this.tokenRequest$ = undefined;
  }
}
