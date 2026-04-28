import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { QuestionComponent } from './question.component';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  const formGroup = new FormGroup({
    '1': new FormControl('1')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: FormGroupDirective,
          useValue: {
            control: formGroup
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark a radio answer as wrong when the selected index is incorrect', () => {
    component.question = {
      _class: 'Question',
      _id: { $oid: '1' },
      assessment_type: 'multiple-choice',
      correct_response: ['a'],
      id: 1,
      prompt: {
        answers: ['A', 'B'],
        explanation: '',
        feedbacks: [],
        question: '',
        relatedLectureIds: ''
      },
      question_plain: 'Sample question',
      section: 'AWS Storage'
    };
    component.questionControlName = '1';

    expect(component.isWrongResponse(1)).toBe(true);
  });
});
