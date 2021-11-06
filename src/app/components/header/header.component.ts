import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { QUESTIONARIES } from '../../config/constants';
import { Question } from '../../interfaces/Question';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() questionaryChangeEvent = new EventEmitter<Question[]>();

  public QUESTIONARIES = QUESTIONARIES;
  public questionaryName: string = QUESTIONARIES[0];

  constructor(
    private _dataService: DataService,
  ) { }

  public ngOnInit(): void {
    console.log(this.questionaryName);
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

  public getSelectedQuestionary(event: any) {
    this._dataService.getQuestions(event.target.value).subscribe ( result => {
      this.questionaryChangeEvent.emit(result.questions);
    });
  }
}
