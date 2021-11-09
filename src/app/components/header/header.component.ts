import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { QUESTIONARIES, SECTION } from '../../config/constants';
import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() questionaryChangeEvent = new EventEmitter<Question[]>();
  @Output() filter = new EventEmitter<string>();

  public QUESTIONARIES = QUESTIONARIES;
  public SECTION = SECTION;
  public filterName = '';
  public questionaryName: string = QUESTIONARIES[0];

  constructor(
    private _dataService: DataService,
  ) { }

  public ngOnInit(): void {
    this._dataService.getQuestions(this.questionaryName).subscribe ( result => {
      this.questionaryChangeEvent.emit(result.questions);
    });
  }

  public toggle(): void {
    let navigation = document.querySelector('.navigation');
    let main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }

  public getSelectedQuestionary(event: any): void {
    this._dataService.getQuestions(event.target.value).subscribe ( result => {
      this.filterName = SECTION[0];
      this.questionaryChangeEvent.emit(result.questions);
    });
  }

  public setFilter(event: any): void {
    this.filter.emit(event.target.value);
  }
}
