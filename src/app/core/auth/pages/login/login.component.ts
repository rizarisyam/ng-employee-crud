import { Component, inject, OnInit, signal } from '@angular/core';
import {CardModule} from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginFormControls {
username: FormControl<string>;
password: FormControl<string>;
rememberMe: FormControl<boolean>;
}
@Component({
  selector: 'app-login',
  imports: [CardModule,InputTextModule,ToggleSwitchModule,IconFieldModule,InputIconModule, CommonModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  

  passwordVisibility = signal(false)

  private router = inject(Router)

  
  private fb = inject(FormBuilder)
  form!: FormGroup<LoginFormControls>;

  onTogglePasswordVisibility() {
    this.passwordVisibility.update(prev => !prev)
  }

  initForm() {
    this.form = this.fb.group({
      username: this.fb.nonNullable.control('', [Validators.required]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
      rememberMe: this.fb.nonNullable.control(false)
    })
  }

  
  ngOnInit(): void {
    this.initForm()
    this.markAllControlsDirtyAndTouched(this.form)
  }

  onSubmit() {
    if (this.form.valid) {
      const { username, password, rememberMe } = this.form.value;
      console.log('Form submitted:', { username, password, rememberMe });

      this.router.navigate(['/employee'])
      // Handle login logic here
    } else {
      this.markAllControlsDirtyAndTouched(this.form);
    }
  }

  private markAllControlsDirtyAndTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsDirty();
      control.markAsTouched();
  
      if ((control as FormGroup).controls) {
        this.markAllControlsDirtyAndTouched(control as FormGroup);
      }
    });
  }
}
