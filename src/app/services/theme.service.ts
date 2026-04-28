import { Injectable, signal } from '@angular/core';

const THEME_STORAGE_KEY = 'app-theme';

@Injectable()
export class ThemeService {
  private readonly themeSignal = signal(this.loadTheme());
  readonly theme = this.themeSignal.asReadonly();

  setTheme(theme: string): void {
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  getTheme(): string {
    return this.themeSignal();
  }

  private loadTheme(): string {
    return localStorage.getItem(THEME_STORAGE_KEY) || '';
  }
}
