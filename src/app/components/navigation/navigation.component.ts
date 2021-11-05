import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  public hover = {
    questions: false,
    settings: false,
  };

  public hovered = {
    questions: false,
    settings: false,
  };

  public activeLink($event: any, indicator: string): void {
    // Remove hover class in all the elements
    let list = document.querySelectorAll('.navigation li');
    list.forEach(item => {
        item.classList.remove('hovered');
    })
  }
}
