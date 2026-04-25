import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchingValidatior });
  }

  async onSubmit() {
    if (this.form.valid) {
      this.authService.register({
        email: this.form.value.email,
        password: this.form.value.password
      }).subscribe({
        next: async () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro',
            detail: 'Usuario creado',
            life: 5000,
          });
          await this.router.navigate(['/login']);
        },
        error: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Error with Email or Password';
          this.messageService.add({
            severity: 'error',
            summary: 'Registro',
            detail: message,
            life: 10000,
          });
        }
      });
    }
  }

  passwordMatchingValidatior: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    return password?.value === confirmPassword?.value ? null : { notmatched: true };
  };
}
