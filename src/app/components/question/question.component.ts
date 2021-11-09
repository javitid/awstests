import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';

import { ASSESSMENT_TYPE } from '../../config/constants';
import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    }
  ]
})
export class QuestionComponent{
  @Input()
  public questionNumber?: number;
  @Input()
  public question?: Question;
  @Input()
  public questionControlName?: string;

  public ASSESSMENT_TYPE = ASSESSMENT_TYPE;
  public showResponse = false;
  public showExplanation = false;
  public questionsForm: FormGroup;

  constructor(
    private _dataService: DataService,
  ) { 
    this.questionsForm = this._dataService.getQuestionsForm();
  }

  public isAssessmentType(assessment_type: string): boolean {
    return this.question?.assessment_type === assessment_type;
  }

  public isResponseOfIndex(index: number): boolean {
    let response = this.mapResponse(index);
    return !!this.question?.correct_response.find(element => element === response);
  }

  public getOptionText(option: string): string {
    return option.replace('<p>','').replace('</p>','');
  }

  public toggleResult(): void {
    this.showResponse = !this.showResponse;
  }

  public toggleExplanation(): void {
    this.showExplanation = !this.showExplanation;
  }

  private mapResponse(index: number): string {
    let response;
    switch (index) {
      case 0:
        response = 'a';
        break;
      case 1:
        response = 'b';
        break;
      case 2:
        response = 'c';
        break;
      case 3:
        response = 'd';
        break;
      case 4:
        response = 'e';
        break;
      default:
        response = '';
    }
    return response;
  }
}
