import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpService } from '../../../../core/services/common-http.service';

import { tap } from 'rxjs';
import { EmployeeType } from '../../employee.type';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-list-employee',
  imports: [
    CommonModule,
    TableModule,
    ToggleSwitchModule,
    FormsModule,
    TextareaModule,
    CardModule,
  ],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss',
})
export class ListEmployeeComponent implements OnInit {
  private httpService = inject(HttpService);

  employees = signal<EmployeeType[]>([]);

  ngOnInit(): void {
    this.httpService
      .get<EmployeeType[]>('http://localhost:3000/employees', {
        _limit: 10,
        _page: 1,
      })
      .pipe(tap((res) => this.employees.set(res)))
      .subscribe();
  }
}
