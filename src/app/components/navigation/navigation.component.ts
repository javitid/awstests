import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  private list = document.querySelectorAll('.navigation li');

  public activeLink($event: any): void {
    // Add hovered class in selected menu element
    let list = document.querySelectorAll('.navigation li');
    list.forEach(item => {
      item.classList.remove('hovered');
      $event.srcElement.parentElement.classList.add('hovered');
    })
  }
}
