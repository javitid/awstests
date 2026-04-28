import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { QuizStateService } from '../../services/quiz-state.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let quizStateService: {
    allQuestions: jest.Mock<unknown[], []>;
    filteredQuestions: jest.Mock<unknown[], []>;
    questionsForm: jest.Mock<FormGroup, []>;
    loadQuestionary: jest.Mock<void, []>;
  };

  beforeEach(async () => {
    quizStateService = {
      allQuestions: jest.fn().mockReturnValue([]),
      filteredQuestions: jest.fn().mockReturnValue([]),
      questionsForm: jest.fn().mockReturnValue(new FormGroup({})),
      loadQuestionary: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: QuizStateService,
          useValue: quizStateService
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the default questionnaire when state is empty', () => {
    expect(quizStateService.loadQuestionary).toHaveBeenCalled();
  });
});
