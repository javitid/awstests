import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PATH } from '../../config/constants';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  public isPwdHidden = true;
  public readonly firebaseConfigured = this.authService.isFirebaseReady();

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly messageService: MessageService
  ) {}

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.signInWithGoogle();
      await this.router.navigate([PATH.DASHBOARD]);
    } catch (error) {
      this.showError(error);
    }
  }

  async continueAsGuest(): Promise<void> {
    try {
      await this.authService.signInAsGuest();
      await this.router.navigate([PATH.DASHBOARD]);
    } catch (error) {
      this.showError(error);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.authService.login({
      email: this.form.value.email || '',
      password: this.form.value.password || '',
    }).subscribe({
      next: async () => {
        await this.router.navigate([PATH.DASHBOARD]);
      },
      error: (error) => this.showError(error),
    });
  }

  private showError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : 'No se pudo iniciar sesion.';
    this.messageService.add({
      severity: 'error',
      summary: 'Login',
      detail: message,
      life: 6000,
    });
  }
}
