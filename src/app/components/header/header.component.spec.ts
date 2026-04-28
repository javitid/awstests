import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from './header.component';
import { LayoutService } from '../../services/layout.service';
import { QuizStateService } from '../../services/quiz-state.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let quizStateService: {
    sections: jest.Mock<string[], []>;
    selectedSection: jest.Mock<string, []>;
    selectedQuestionary: jest.Mock<string, []>;
    setSelectedSection: jest.Mock<void, [string]>;
    loadQuestionary: jest.Mock<void, [string?]>;
  };

  beforeEach(async () => {
    quizStateService = {
      sections: jest.fn().mockReturnValue(['all']),
      selectedSection: jest.fn().mockReturnValue('all'),
      selectedQuestionary: jest.fn().mockReturnValue('architectA1'),
      setSelectedSection: jest.fn(),
      loadQuestionary: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [FormsModule],
      providers: [
        {
          provide: QuizStateService,
          useValue: quizStateService
        },
        {
          provide: LayoutService,
          useValue: {
            toggleNavigation: jest.fn()
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.isFilter = false;
    component.isQuestionary = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the selected filter', () => {
    component.setFilter({ value: 'AWS Storage' });
    expect(quizStateService.setSelectedSection).toHaveBeenCalledWith('AWS Storage');
  });

  it('should load the selected questionnaire', () => {
    component.getSelectedQuestionary({ value: 'developerA1' });
    expect(quizStateService.loadQuestionary).toHaveBeenCalledWith('developerA1');
  });
});
