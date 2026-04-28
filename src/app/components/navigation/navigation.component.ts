import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PATH, THEMES } from '../../config/constants';
import { AuthService } from '../../services/auth.service';
import { HelperService } from '../../services/helper.service';
import { LayoutService } from '../../services/layout.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navigation',
  standalone: false,
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent implements OnInit {
  @HostBinding('class') _componentCssClass = '';

  public PATH = PATH;
  public isThemeSelected = false;

  constructor(
    private _helperService: HelperService,
    private _themeService: ThemeService,
    private _authService: AuthService,
    public readonly layoutService: LayoutService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Load the theme from service and sync the toggle
    const currentTheme = this._themeService.getTheme();
    this.isThemeSelected = currentTheme === THEMES.DARK;
  }

  public onSetTheme(): void {
    const newTheme = this.isThemeSelected ? THEMES.DARK : THEMES.LIGHT;
    this._themeService.setTheme(newTheme);
    this.closeNavigationOnSmallScreen();
  }

  public async onLogout(): Promise<void> {
    await this._authService.signOutExternal();
    this.closeNavigationOnSmallScreen();
    await this._router.navigate([PATH.LOGIN]);
  }

  public onNavigationItemSelected(): void {
    this.closeNavigationOnSmallScreen();
  }

  private closeNavigationOnSmallScreen(): void {
    if (this._helperService.isSmallScreen) {
      this.layoutService.closeNavigation();
    }
  }
}
