import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { HttpService } from '../../../../core/services/common-http.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { tap } from 'rxjs';

interface EmployeeFormControls {
  first_name: FormControl<string>;
  last_name: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  birthdate: FormControl<Date>;
  basic_salary: FormControl<number>;
  status: FormControl<boolean>;
  group: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-create-employee',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    ToggleSwitchModule,
    SelectModule,
    TextareaModule,
    ButtonModule,
    RouterModule,
    Toast
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss',
  providers: [MessageService],
})
export class CreateEmployeeComponent implements OnInit {
  ngOnInit(): void {
    this.initForm();

    this.markFormGroupDirty(this.employeeForm);
  }

  private httpService = inject(HttpService)
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected employeeForm!: FormGroup<EmployeeFormControls>;

  maxDate: Date = new Date();

  departments: string[] = [
    'Human Resources',
    'Information Technology',
    'Sales',
    'Marketing',
    'Finance',
    'Customer Support',
    'Legal',
    'Operations',
    'Research and Development',
    'Procurement'
  ];

  private initForm() {
    this.employeeForm = this.fb.nonNullable.group({
      first_name: this.fb.nonNullable.control('', [Validators.required]),
      last_name: this.fb.nonNullable.control('',[Validators.required]),
      username: this.fb.nonNullable.control('',[Validators.required]),
      email: this.fb.nonNullable.control('',[Validators.required,Validators.email]),
      birthdate: this.fb.nonNullable.control(new Date(),[Validators.required]),
      basic_salary: this.fb.nonNullable.control(0,[Validators.required]),
      status: this.fb.nonNullable.control(true,[Validators.required]),
      group: this.fb.nonNullable.control('',[Validators.required]),
      description: this.fb.nonNullable.control('',[Validators.required]),
    });
  }

  markFormGroupDirty(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupDirty(control); // recursively mark nested controls
      } else {
        control.markAsDirty();
        control.updateValueAndValidity(); // optional, to trigger validators
      }
    });
  
    formGroup.markAsDirty();
  }

  onSubmit() {
    if(this.employeeForm.invalid) {
      this.markFormGroupDirty(this.employeeForm);
      return;
    }
    
    const formData = Object.entries(this.employeeForm.getRawValue()).reduce((acc, [key, value]) => {
      if (key === 'birthdate') {
        acc[key] = typeof value === 'object' ? new Date(value).toISOString().split('T')[0] : value; // Format date as YYYY-MM-DD
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);
    console.log('Form Data:', formData);

    this.httpService.post('http://localhost:3000/employees', formData).pipe(
      tap(res => {
      this.messageService.add({ severity: 'success', summary: 'Info', detail: 'Message Content', life: 3000 });
      }),
      tap(() => {
      // Delay navigation using RxJS timer
      import('rxjs').then(({ timer }) => {
        timer(2000).subscribe(() => this.router.navigate(['/employee']));
      });
      })
    ).subscribe();
  }
}
