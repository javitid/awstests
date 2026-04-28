import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

import { ASSESSMENT_TYPE } from '../../config/constants';
import { Question } from '../../interfaces/Question';

@Component({
  selector: 'app-question',
  standalone: false,
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent{
  @Input()
  public questionNumber?: number;
  @Input()
  public question?: Question;
  @Input()
  public questionControlName = '';

  public ASSESSMENT_TYPE = ASSESSMENT_TYPE;
  public showResponse = false;
  public showExplanation = false;

  public isAssessmentType(assessment_type: string): boolean {
    return this.question?.assessment_type === assessment_type;
  }

  public isCorrectResponse(index: number): boolean {
    const response = this.mapResponse(index);
    return !!this.question?.correct_response.find(element => element === response);
  }

  public isWrongResponse(index: number): boolean {
    const currentValue = this.controlContainer.control?.get(this.questionControlName)?.value;
    return !this.isCorrectResponse(index) &&
           currentValue == index &&
           this.isAssessmentType(ASSESSMENT_TYPE.RADIO);
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

  private get controlContainer(): FormGroupDirective {
    return this.formGroupDirective;
  }

  constructor(private readonly formGroupDirective: FormGroupDirective) {}
}
