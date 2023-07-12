import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { QUESTIONARIES, SECTION } from '../../config/constants';
import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isFilter = true;
  @Input() isQuestionary = true;
  @Output() questionaryChangeEvent = new EventEmitter<Question[]>();
  @Output() filter = new EventEmitter<string>();

  public QUESTIONARIES = QUESTIONARIES;
  public SECTION = SECTION;
  public filterName = 'all';
  public questionaryName: string = QUESTIONARIES[0];

  constructor(
    private _dataService: DataService,
  ) { }

  public ngOnInit(): void {
    this._dataService.getQuestions(this.questionaryName).subscribe ( result => {
      this.questionaryChangeEvent.emit(result.documents);
    });
  }

  public toggle(): void {
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }

  public getSelectedQuestionary(event: any): void {
    this._dataService.getQuestions(event.value).subscribe ( result => {
      this.filterName = SECTION[0];
      this.questionaryChangeEvent.emit(result.documents);
    });
  }

  public setFilter(event: any): void {
    this.filter.emit(event.value);
  }
}
