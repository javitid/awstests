import { Injectable, computed, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { QUESTIONARIES } from '../config/constants';
import { Question } from '../interfaces/Question';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class QuizStateService {
  private readonly allQuestionsSignal = signal<Question[]>([]);
  private readonly selectedQuestionarySignal = signal<string>(QUESTIONARIES[0]);
  private readonly selectedSectionSignal = signal<string>('all');
  private readonly sectionsSignal = signal<string[]>(['all']);
  private readonly questionsFormSignal = signal(new FormGroup({}));

  readonly allQuestions = this.allQuestionsSignal.asReadonly();
  readonly selectedQuestionary = this.selectedQuestionarySignal.asReadonly();
  readonly selectedSection = this.selectedSectionSignal.asReadonly();
  readonly sections = this.sectionsSignal.asReadonly();
  readonly questionsForm = this.questionsFormSignal.asReadonly();
  readonly filteredQuestions = computed(() => {
    const selectedSection = this.selectedSectionSignal();
    const questions = this.allQuestionsSignal();

    if (selectedSection === 'all') {
      return questions;
    }

    return questions.filter((question) => question.section === selectedSection);
  });

  constructor(private readonly dataService: DataService) {}

  loadQuestionary(questionaryName: string = this.selectedQuestionarySignal()): void {
    this.dataService.getQuestions(questionaryName).subscribe((result) => {
      this.selectedQuestionarySignal.set(questionaryName);
      this.allQuestionsSignal.set(result.documents);
      this.selectedSectionSignal.set('all');
      this.sectionsSignal.set(this.buildSections(result.documents));
      this.questionsFormSignal.set(this.buildQuestionsForm(result.documents));
    });
  }

  setSelectedSection(section: string): void {
    this.selectedSectionSignal.set(section);
  }

  private buildSections(questions: Question[]): string[] {
    const uniqueSections = Array.from(
      new Set(questions.map((question) => question.section))
    ).sort();

    return ['all', ...uniqueSections];
  }

  private buildQuestionsForm(questions: Question[]): FormGroup {
    const controls = questions.reduce<Record<string, FormControl>>(
      (accumulator, question) => {
        accumulator[question.id.toString()] = new FormControl(null);
        return accumulator;
      },
      {}
    );

    return new FormGroup(controls);
  }
}
