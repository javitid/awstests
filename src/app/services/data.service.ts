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
const URL_GET_QUESTIONARY: string = "https://eu-central-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/aws_tests-keftk/service/getQuestions/incoming_webhook/webhook0?questionary=";

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
      questions = this.http.get<Questions>(URL_GET_QUESTIONARY + questionaryName).pipe(shareReplay(1));
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