import { Component, Input, OnInit } from '@angular/core';

import { Question } from '../../interfaces/Question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  @Input()
  public questionNumber?: number;
  @Input()
  public question?: Question;

  constructor() { }

  ngOnInit(): void {
  }

}
