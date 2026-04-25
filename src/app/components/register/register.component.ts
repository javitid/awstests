import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    private _snackBar: MatSnackBar
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
          this._snackBar.open('User created', 'Close', {
            duration: 5000,
          });
          await this.router.navigate(['/login']);
        },
        error: (error: unknown) => {
          const message = error instanceof Error ? error.message : 'Error with Email or Password';
          this._snackBar.open(message, 'Close', {
            duration: 10000,
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
