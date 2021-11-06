import { Component, Input } from '@angular/core';

import { ASSESSMENT_TYPE } from '../../config/constants';
import { Question } from '../../interfaces/Question';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent{
  @Input()
  public questionNumber?: number;
  @Input()
  public question?: Question;

  public ASSESSMENT_TYPE = ASSESSMENT_TYPE;
  public showResponse = false;

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
