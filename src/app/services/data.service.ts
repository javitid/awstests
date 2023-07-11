import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { QUESTIONARIES } from '../config/constants';
import { Questions } from '../interfaces/Question';

var questions: Observable<Questions>;
var questionary = new Map();
var questionsForm = new FormGroup({});
const URL_POST_QUESTIONARY = 'https://eu-west-2.aws.data.mongodb-api.com/app/data-iuwtk/endpoint/data/v1/action/find';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpError?: HttpErrorResponse;
  
  constructor(private http: HttpClient) { }

  getQuestions(questionaryName: string = QUESTIONARIES[0]): Observable<Questions>{
    if (questionary.has(questionaryName)) {
      questions = questionary.get(questionaryName);
    } else {
      const requestHeaders = {
        'Accept': 'application/json',
      }

      const requestBody = {
        dataSource: 'Cluster0',
        database: 'awstests',
        collection: questionaryName
    };
      questions = this.http.post<Questions>(URL_POST_QUESTIONARY, requestBody, {headers: requestHeaders}).pipe(shareReplay(1));
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