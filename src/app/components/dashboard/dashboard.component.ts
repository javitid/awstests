import { Component } from '@angular/core';

import { Question } from '../../interfaces/Question';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public questions: Question[] = [];

  questionaryChangeEvent(event: Question[]): void {
    this.questions = event;
  }
}
