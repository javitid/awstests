import { ChangeDetectionStrategy, Component, DestroyRef, HostBinding, OnInit, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable, filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { transformer } from './route-animations';

import { AuthService } from './services/auth.service';
import { LayoutService } from './services/layout.service';
import { ThemeService } from './services/theme.service';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @HostBinding('attr.class') _componentCssClass: unknown;
  title = 'awstests';
  private GOOGLE_ANALYTICS_ID = 'G-PTNVG3SZ8W';
  private readonly destroyRef = inject(DestroyRef);
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private _router: Router,
    private _themeService: ThemeService,
    private _authService: AuthService,
    public readonly layoutService: LayoutService
  ) {
    this.isAuthenticated$ = this._authService.isAuthenticated$();
    effect(() => {
      this._componentCssClass = this._themeService.theme();
    });
  }

  ngOnInit(): void {
    this.setUpAnalytics();
  }

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  public setUpAnalytics() {
    this._router.events.pipe(filter(event => event instanceof NavigationEnd))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
          gtag('config', this.GOOGLE_ANALYTICS_ID,
              {
                  page_path: (event as NavigationEnd).urlAfterRedirects
              }
          );
      });
  }
}
