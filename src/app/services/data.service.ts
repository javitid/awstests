import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Questions } from '../interfaces/Question';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpError?: HttpErrorResponse;
  getQuestionsUrl: string = "https://eu-central-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/aws_tests-keftk/service/getQuestions/incoming_webhook/webhook0?questionary=";
  
  constructor(private http: HttpClient) { }

  // getQuestions(): Observable<Questions>{
  //   const questions = this.http.get<Questions>(this.getQuestionsUrl);
  //   return questions;
  // }

  getQuestions(questionaryName?: string): Observable<Questions>{
    const questions = this.http.get<Questions>(this.getQuestionsUrl + questionaryName);
    return questions;
  }

  getHttpError(): HttpErrorResponse|undefined  {
    return this.httpError;
  }

  setHttpError(error: HttpErrorResponse): void {
    this.httpError = error;
  }
}