import { Component } from '@angular/core';

import { PATH } from '../../config/constants';

const HOVERED = 'hovered';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  public PATH = PATH;

  public activeLink($event: any): void {
    // Add hovered class in selected menu element
    let list = document.querySelectorAll('.navigation li');
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
  }
}
