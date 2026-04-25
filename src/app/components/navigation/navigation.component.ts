import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { PATH, THEMES } from '../../config/constants';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../services/helper.service';
import { ThemeService } from '../../services/theme.service';

const HOVERED = 'hovered';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Output() themeChangeEvent = new EventEmitter<string>();
  @HostBinding('class') _componentCssClass = '';

  public PATH = PATH;
  public isThemeSelected = false;

  constructor(
    private _helperService: HelperService,
    private _themeService: ThemeService,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Load the theme from service and sync the toggle
    const currentTheme = this._themeService.getTheme();
    this.isThemeSelected = currentTheme === THEMES.DARK;
  }

  public activeLink(event: Event): void {
    // Add hovered class in selected menu element
    const list = document.querySelectorAll('.navigation li');
    list.forEach(item => {
      item.classList.remove(HOVERED);
    });

    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }

    switch(target.tagName) {
      case 'A':
        target.parentElement?.classList.add(HOVERED);
        break;
      case 'SPAN':
        target.parentElement?.parentElement?.classList.add(HOVERED);
        break;
      case 'I':
        target.parentElement?.parentElement?.classList.add(HOVERED);
        break;
      case 'IMG':
        target.parentElement?.parentElement?.parentElement?.classList.add(HOVERED);
        break;
    }

    if (this._helperService.isSmallScreen){this.toggle();}
  }

  public onSetTheme(): void {
    const newTheme = this.isThemeSelected ? THEMES.DARK : THEMES.LIGHT;
    this.themeChangeEvent.emit(newTheme);
    if (this._helperService.isSmallScreen){this.toggle();}
  }

  public async onLogout(): Promise<void> {
    await this._authService.signOutExternal();
    await this._router.navigate([PATH.LOGIN]);
  }

  private toggle(): void {
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');

    navigation?.classList.toggle('active');
    main?.classList.toggle('active');
  }
}
