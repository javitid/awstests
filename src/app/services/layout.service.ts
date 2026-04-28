import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private readonly navigationActiveSignal = signal(false);

  readonly navigationActive = this.navigationActiveSignal.asReadonly();

  toggleNavigation(): void {
    this.navigationActiveSignal.update((currentValue) => !currentValue);
  }

  closeNavigation(): void {
    this.navigationActiveSignal.set(false);
  }
}
