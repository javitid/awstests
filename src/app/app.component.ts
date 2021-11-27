import { Component, HostBinding } from '@angular/core';

import { ThemeService } from "./services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('attr.class') _componentCssClass: any;
  title = 'awstests';

  constructor(private _themeService: ThemeService) {}

  public onSetTheme(theme: string) {
    this._componentCssClass = theme;
    this._themeService.setTheme(theme);
  }
}
