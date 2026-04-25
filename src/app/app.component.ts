import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable, filter } from 'rxjs';

import { transformer } from './route-animations';

import { AuthService } from './services/auth.service';
import { ThemeService } from "./services/theme.service";

declare let gtag: (...args: unknown[]) => void;

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // fader,
    // horizontalSlider
    // slider,
    // stepper,
    transformer,
  ]
})
export class AppComponent implements OnInit {
  @HostBinding('attr.class') _componentCssClass: unknown;
  title = 'awstests';
  private GOOGLE_ANALYTICS_ID = 'G-PTNVG3SZ8W';
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private _router: Router,
    private _themeService: ThemeService,
    private _authService: AuthService
  ) {
    this.isAuthenticated$ = this._authService.isAuthenticated$();
  }

  ngOnInit(): void {
    this.setUpAnalytics();
    // Initialize theme from stored value
    const savedTheme = this._themeService.getTheme();
    if (savedTheme) {
      this._componentCssClass = savedTheme;
    }
  }

  public onSetTheme(theme: string): void {
    this._componentCssClass = theme;
    this._themeService.setTheme(theme);
  }

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  public setUpAnalytics() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
          gtag('config', this.GOOGLE_ANALYTICS_ID,
              {
                  page_path: (event as NavigationEnd).urlAfterRedirects
              }
          );
      });
  }
}
