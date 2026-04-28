import { ChangeDetectionStrategy, Component } from '@angular/core';

import { QuizStateService } from '../../services/quiz-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(public readonly quizState: QuizStateService) {
    if (this.quizState.allQuestions().length === 0) {
      this.quizState.loadQuestionary();
    }
  }
}
