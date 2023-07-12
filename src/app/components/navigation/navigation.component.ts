import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

import { PATH, THEMES } from '../../config/constants';
import { HelperService } from '../../services/helper.service';

const HOVERED = 'hovered';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Output() themeChangeEvent = new EventEmitter<string>();
  @HostBinding('class') _componentCssClass: any;

  public PATH = PATH;
  public isThemeSelected = false;

  constructor(private _helperService: HelperService) {}

  public activeLink($event: any): void {
    // Add hovered class in selected menu element
    const list = document.querySelectorAll('.navigation li');
    list.forEach(item => {
      item.classList.remove(HOVERED);
    });

    switch($event.target.tagName) {
      case 'A':
        $event.srcElement.parentElement.classList.add(HOVERED);
        break;
      case 'SPAN':
        $event.srcElement.parentElement.parentElement.classList.add(HOVERED);
        break;
      case 'IMG':
        $event.srcElement.parentElement.parentElement.parentElement.classList.add(HOVERED);
        break;
    }

    if (this._helperService.isSmallScreen){this.toggle();}
  }

  public onSetTheme() {
    this.themeChangeEvent.emit(this.isThemeSelected ? THEMES.DARK : THEMES.LIGHT);
    if (this._helperService.isSmallScreen){this.toggle();}
  }

  private toggle(): void {
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }
}
