import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { QUESTIONARIES } from '../config/constants';
import { Questions } from '../interfaces/Question';
import { MongoDataAuthService } from './mongo-data-auth.service';

let questions: Observable<Questions>;
let questionsForm = new FormGroup({});
const questionary = new Map();

@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpError?: HttpErrorResponse;
  
  constructor(
    private readonly http: HttpClient,
    private readonly mongoDataAuthService: MongoDataAuthService
  ) { }

  getQuestions(questionaryName: string = QUESTIONARIES[0]): Observable<Questions>{
    if (questionary.has(questionaryName)) {
      questions = questionary.get(questionaryName);
    } else {
      const requestBody = {
        dataSource: 'Cluster0',
        database: 'awstests',
        collection: questionaryName
      };
      questions = this.mongoDataAuthService.getToken().pipe(
        switchMap((token) => {
          const requestHeaders = new HttpHeaders({
            Accept: 'application/json',
            Authorization: token,
          });

          return this.http.post<Questions>(environment.urlPostQuestionaries, requestBody, {
            headers: requestHeaders,
          });
        }),
        catchError((error: HttpErrorResponse) => {
          questionary.delete(questionaryName);

          if (error.status === 401) {
            this.mongoDataAuthService.clearToken();
          }

          this.setHttpError(error);
          return throwError(error);
        }),
        shareReplay(1)
      );
      questionary.set(questionaryName, questions);
    }
    return questions;
  }

  getHttpError(): HttpErrorResponse|undefined  {
    return this.httpError;
  }

  setHttpError(error: HttpErrorResponse): void {
    this.httpError = error;
  }

  getQuestionsForm(): FormGroup {
    return questionsForm;
  }

  setQuestionsForm(formGroup: FormGroup): void {
    questionsForm = formGroup;
  }
}
