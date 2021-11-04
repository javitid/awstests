import { Component, OnInit } from '@angular/core';

import { QUESTIONARIES } from '../../config/constants';
import { Question, Questions } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public QUESTIONARIES = QUESTIONARIES;
  public questions: Question[] = [];
  public selectedQuestionary: string = QUESTIONARIES[0];

  constructor(
    private _dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.getQuestions(this.selectedQuestionary);
  }

  public getSelectedQuestionary(event: any) {
    this.selectedQuestionary = event.target.value;
    this.getQuestions(this.selectedQuestionary);
  }

  private getQuestions(questionary: string): void {
    this._dataService.getQuestions(questionary).subscribe( (response: Questions) => {
      this.questions = response.questions;

      // TODO: Remove
      console.log(this.questions);
    });
  }

}
