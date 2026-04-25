import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { collection, getDocs } from 'firebase/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

import { QUESTIONARIES } from '../config/constants';
import { Question, Questions } from '../interfaces/Question';
import { getFirebaseFirestoreInstance } from '../config/firebase.config';

let questionsForm = new FormGroup({});

@Injectable({
  providedIn: 'root'
})
export class DataService {
  httpError?: unknown;
  private readonly firestore = getFirebaseFirestoreInstance();
  private readonly questionnaireCache = new Map<string, Observable<Questions>>();

  getQuestions(questionaryName: string = QUESTIONARIES[0]): Observable<Questions>{
    if (this.questionnaireCache.has(questionaryName)) {
      return this.questionnaireCache.get(questionaryName) as Observable<Questions>;
    }

    const questions$ = from(getDocs(collection(this.firestore, questionaryName))).pipe(
      map((snapshot) => ({
        documents: snapshot.docs.map((documentSnapshot) => {
          const data = documentSnapshot.data() as Omit<Question, '_id'>;
          return {
            _id: { $oid: documentSnapshot.id },
            ...data,
          } as Question;
        }),
      })),
      catchError((error: unknown) => {
        this.questionnaireCache.delete(questionaryName);
        this.setHttpError(error);
        return throwError(() => error);
      }),
      shareReplay(1)
    );

    this.questionnaireCache.set(questionaryName, questions$);
    return questions$;
  }

  getHttpError(): unknown {
    return this.httpError;
  }

  setHttpError(error: unknown): void {
    this.httpError = error;
  }

  getQuestionsForm(): FormGroup {
    return questionsForm;
  }

  setQuestionsForm(formGroup: FormGroup): void {
    questionsForm = formGroup;
  }
}
