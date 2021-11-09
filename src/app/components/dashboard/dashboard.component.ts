import { Component } from '@angular/core';

import { Question } from '../../interfaces/Question';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public allQuestions: Question[] = [];
  public questions: Question[] = [];
  public filter: string = '';

  questionaryChangeEvent(event: Question[]): void {
    this.questions = event;
    this.allQuestions = event;
  }

  filterChangeEvent(section: string): void {
    this.questions = [...this.allQuestions];
    if (section !== 'all') {
      this.questions = this.questions.filter( (question: Question) => question.section === section);
    }
  }
}
