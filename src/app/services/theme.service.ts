import { Injectable } from "@angular/core";

const THEME_STORAGE_KEY = 'app-theme';

@Injectable()
export class ThemeService {
  private _theme = '';

  constructor() {
    this._theme = this.loadTheme();
  }

  setTheme(theme: string): void {
    this._theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  getTheme(): string {
    return this._theme;
  }

  private loadTheme(): string {
    return localStorage.getItem(THEME_STORAGE_KEY) || '';
  }
}