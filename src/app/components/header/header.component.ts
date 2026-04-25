import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { QUESTIONARIES } from '../../config/constants';
import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isFilter = true;
  @Input() isQuestionary = true;
  @Output() questionaryChangeEvent = new EventEmitter<Question[]>();
  @Output() filter = new EventEmitter<string>();

  public QUESTIONARIES = QUESTIONARIES;
  public SECTION: string[] = ['all'];
  public filterName = 'all';
  public questionaryName: string = QUESTIONARIES[0];

  constructor(
    private _dataService: DataService,
  ) { }

  public ngOnInit(): void {
    this._dataService.getQuestions(this.questionaryName).subscribe (result => {
      this.updateSections(result.documents);
      this.questionaryChangeEvent.emit(result.documents);
    });
  }

  public toggle(): void {
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }

  public getSelectedQuestionary(event: {value: string}): void {
    const selectedQuestionary = event?.value ?? this.questionaryName;

    this._dataService.getQuestions(selectedQuestionary).subscribe((result) => {
      this.updateSections(result.documents);
      this.filterName = 'all';
      this.filter.emit(this.filterName);
      this.questionaryChangeEvent.emit(result.documents);
    });
  }

  public setFilter(event: {value: string}): void {
    const section = event?.value ?? this.filterName;
    this.filter.emit(section);
  }

  private updateSections(questions: Question[]): void {
    const uniqueSections = Array.from(new Set(questions.map((question) => question.section))).sort();
    this.SECTION = ['all', ...uniqueSections];
  }
}
