import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  public settingsForm: FormGroup;
  public firstName: FormControl;
  public lastName: FormControl;
  public maxLength = 60;

  constructor(formBuilder: FormBuilder){
    this.firstName = new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]);
    this.lastName = new FormControl('', [Validators.required, Validators.maxLength(this.maxLength)]);

    this.settingsForm = formBuilder.group({
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.settingsForm.controls[controlName].hasError(errorName);
  }
}
