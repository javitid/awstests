import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public allQuestions: Question[] = [];
  public questions: Question[] = [];
  public filter: string = '';
  public questionsForm: FormGroup;

  constructor(
    private _dataService: DataService,
  ) { 
    this.questionsForm = this._dataService.getQuestionsForm();
  }

  // Called from header when a new questionary is loaded
  questionaryChangeEvent(event: Question[]): void {
    this.questions = event;
    this.allQuestions = event;

    // Add form control for each question to be able to get/set the question value
    this.questions.map((question: Question) => {
      this.questionsForm.addControl(question.id.$numberInt.toString(), new FormControl())
    });
  }

  filterChangeEvent(section: string): void {
    this.questions = [...this.allQuestions];
    if (section !== 'all') {
      this.questions = this.questions.filter( (question: Question) => question.section === section);
    }
  }
}
