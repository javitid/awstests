import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { QUESTIONARIES } from '../config/constants';
import { Questions } from '../interfaces/Question';

let questions: Observable<Questions>;
let questionsForm = new FormGroup({});
const questionary = new Map();

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
      questions = this.http.post<Questions>(environment.urlPostQuestionaries, requestBody, {headers: requestHeaders}).pipe(shareReplay(1));
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