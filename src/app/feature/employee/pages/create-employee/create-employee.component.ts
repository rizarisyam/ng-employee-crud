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
    Toast,
  ],
  templateUrl: './create-employee.component.html',
  styleUrl: './create-employee.component.scss',
  providers: [MessageService],
})
export class CreateEmployeeComponent implements OnInit {
  /**
   * Injected instance of the HttpService used to handle HTTP requests
   * related to employee creation and management.
   * This service provides methods for interacting with the backend API.
   */
  private httpService = inject(HttpService);
  /**
   * Service used to display messages or notifications to the user.
   * This service is injected into the component to handle messaging functionality.
   */
  private messageService = inject(MessageService);
  /**
   * Injects the Angular Router service to enable navigation between routes.
   * This is used for programmatic route changes within the application.
   */
  private router = inject(Router);
  /**
   * An instance of `FormBuilder` injected into the component.
   * Used to create and manage reactive forms within the component.
   */
  private fb = inject(FormBuilder);

  /**
   * A reactive form group that manages the controls for creating an employee.
   * This form group is strongly typed with `EmployeeFormControls` to ensure
   * type safety for the form fields.
   */
  protected employeeForm!: FormGroup<EmployeeFormControls>;

  /**
   * Represents the maximum selectable date, initialized to the current date.
   * This is typically used to restrict date inputs to prevent selecting future dates.
   */
  maxDate: Date = new Date();

  /**
   * A list of department names available in the organization.
   * These departments represent various functional areas within the company.
   *
   * Example departments include:
   * - Human Resources
   * - Information Technology
   * - Sales
   * - Marketing
   * - Finance
   * - Customer Support
   * - Legal
   * - Operations
   * - Research and Development
   * - Procurement
   */
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
    'Procurement',
  ];

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * This method initializes the employee form and marks all form controls as dirty to ensure validation is triggered.
   *
   * @see https://angular.io/api/core/OnInit
   */
  ngOnInit(): void {
    this.initForm();

    this.markFormGroupDirty(this.employeeForm);
  }

  /**
   * Initializes the employee form with default values and validation rules.
   * 
   * The form contains the following fields:
   * - `first_name`: A required text field for the employee's first name.
   * - `last_name`: A required text field for the employee's last name.
   * - `username`: A required text field for the employee's username.
   * - `email`: A required text field for the employee's email address, validated as a proper email format.
   * - `birthdate`: A required date field initialized with the current date.
   * - `basic_salary`: A required numeric field initialized to 0.
   * - `status`: A required boolean field initialized to `true`.
   * - `group`: A required text field for the employee's group.
   * - `description`: A required text field for additional details about the employee.
   * 
   * This method uses Angular's `FormBuilder` to create a strongly-typed, non-nullable reactive form group.
   */
  private initForm() {
    this.employeeForm = this.fb.nonNullable.group({
      first_name: this.fb.nonNullable.control('', [Validators.required]),
      last_name: this.fb.nonNullable.control('', [Validators.required]),
      username: this.fb.nonNullable.control('', [Validators.required]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      birthdate: this.fb.nonNullable.control(new Date(), [Validators.required]),
      basic_salary: this.fb.nonNullable.control(0, [Validators.required]),
      status: this.fb.nonNullable.control(true, [Validators.required]),
      group: this.fb.nonNullable.control('', [Validators.required]),
      description: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  /**
   * Recursively marks all controls within a given `FormGroup` or `FormArray` as dirty.
   * This method ensures that all nested controls, including those within nested `FormGroup` 
   * or `FormArray` instances, are marked as dirty and optionally triggers their validators.
   *
   * @param formGroup - The `FormGroup` or `FormArray` whose controls should be marked as dirty.
   */
  markFormGroupDirty(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupDirty(control); // recursively mark nested controls
      } else {
        control.markAsDirty();
        control.updateValueAndValidity(); // optional, to trigger validators
      }
    });

    formGroup.markAsDirty();
  }

  /**
   * Handles the submission of the employee form.
   * 
   * This method validates the form, processes the form data, and sends a POST request
   * to create a new employee. If the form is invalid, it marks all form controls as dirty
   * to display validation errors. The birthdate field is formatted as `YYYY-MM-DD` before
   * sending the data.
   * 
   * Upon successful submission, a success message is displayed, and the user is navigated
   * to the employee list page after a 2-second delay.
   * 
   * @returns {void} Does not return a value.
   */
  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.markFormGroupDirty(this.employeeForm);
      return;
    }

    const formData = Object.entries(this.employeeForm.getRawValue()).reduce(
      (acc, [key, value]) => {
        if (key === 'birthdate') {
          acc[key] =
            typeof value === 'object'
              ? new Date(value).toISOString().split('T')[0]
              : value; // Format date as YYYY-MM-DD
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, unknown>
    );
    console.log('Form Data:', formData);

    this.httpService
      .post('http://localhost:3000/employees', formData)
      .pipe(
        tap((res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Info',
            detail: 'Message Content',
            life: 3000,
          });
        }),
        tap(() => {
          // Delay navigation using RxJS timer
          import('rxjs').then(({ timer }) => {
            timer(2000).subscribe(() => this.router.navigate(['/employee']));
          });
        })
      )
      .subscribe();
  }
}
