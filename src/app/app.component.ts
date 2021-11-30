import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { fader, horizontalSlider, slider, stepper, transformer } from './route-animations';

import { ThemeService } from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    // fader,
    // horizontalSlider
    // slider,
    stepper,
    // transformer,
  ]
})
export class AppComponent {
  @HostBinding('attr.class') _componentCssClass: any;
  title = 'awstests';

  constructor(private _themeService: ThemeService) {}

  public onSetTheme(theme: string) {
    this._componentCssClass = theme;
    this._themeService.setTheme(theme);
  }

  public prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
