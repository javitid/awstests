import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public toggle(): void {
    // Menu toggle
    let navigation = document.querySelector('.navigation');
    let main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }
}
