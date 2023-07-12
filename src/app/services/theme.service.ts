import { Injectable } from "@angular/core";

@Injectable()
export class ThemeService {
  private _theme = '';

  setTheme(theme: string) {
    this._theme = theme;
  }

  getTheme(): string {
    return this._theme;
  }
}