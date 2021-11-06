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

  public isAssessmentType(assessment_type: string): boolean {
    return this.question?.assessment_type === assessment_type;
  }

  public getOptionText(option: string): string {
    return option.replace('<p>','').replace('</p>','');
  }
}
