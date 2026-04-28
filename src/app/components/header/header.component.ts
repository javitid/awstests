import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QUESTIONARIES } from '../../config/constants';
import { LayoutService } from '../../services/layout.service';
import { QuizStateService } from '../../services/quiz-state.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() isFilter = true;
  @Input() isQuestionary = true;

  public QUESTIONARIES = QUESTIONARIES;

  constructor(
    private readonly layoutService: LayoutService,
    public readonly quizState: QuizStateService
  ) { }

  public toggle(): void {
    this.layoutService.toggleNavigation();
  }

  public getSelectedQuestionary(event: {value: string}): void {
    const selectedQuestionary = event?.value ?? this.quizState.selectedQuestionary();
    this.quizState.loadQuestionary(selectedQuestionary);
  }

  public setFilter(event: {value: string}): void {
    const section = event?.value ?? this.quizState.selectedSection();
    this.quizState.setSelectedSection(section);
  }
}
