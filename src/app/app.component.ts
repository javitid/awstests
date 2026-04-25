import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { transformer } from './route-animations';

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

  constructor(
    private _router: Router,
    private _themeService: ThemeService,
  ) {}

  ngOnInit() {
    this.setUpAnalytics();
  }

  public onSetTheme(theme: string) {
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
