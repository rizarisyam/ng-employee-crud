import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Employee } from '../../employee.type';
import { HttpService } from '../../../../core/services/common-http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-info-employee',
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './info-employee.component.html',
  styleUrl: './info-employee.component.scss'
})
export class InfoEmployeeComponent implements OnInit {

  private httpService = inject(HttpService);
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  employee = signal<Employee>({} as Employee);

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.httpService.get<Employee>(`http://localhost:3000/employees/${id}`)),
      map(employee => ({...employee, basic_salary: String(employee.basic_salary).replace(/\$/g, '')})),
      tap(employee => this.employee.set(employee))
    ).subscribe()
  }

  onGoBack() {
    this.router.navigate(['/employee']);
  }
}
