import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../../core/services/common-http.service';

import { tap } from 'rxjs';
import { EmployeeType } from '../../employee.type';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-list-employee',
  imports: [
    CommonModule,
    TableModule,
    ToggleSwitchModule,
    FormsModule,
    TextareaModule,
    CardModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
  ],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss',
})
export class ListEmployeeComponent implements OnInit {
  private httpService = inject(HttpService);

  pageData = signal<{ per_page: number; page: number; query: string }>({
    per_page: 10,
    page: 1,
    query: '',
  });

  employees = signal<EmployeeType>(null!);

  constructor() {
    effect(() => {
      if (this.pageData()) {
        this.fetchEmployees();
      }
    });
  }

  loadEmployeesLazy(event: TablePageEvent) {
    this.pageData.set({
      per_page: event.rows,
      page: event.first / event.rows + 1,
    });
  }

  ngOnInit(): void {}
  fetchEmployees() {
    this.httpService
      .get<EmployeeType>('http://localhost:3000/employees', {
        _per_page: this.pageData().per_page,
        _page: this.pageData().page,
      })
      .pipe(tap((res) => this.employees.set(res)))
      .subscribe();
  }
}
