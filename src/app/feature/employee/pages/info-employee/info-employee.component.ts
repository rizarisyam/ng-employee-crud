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

  /**
   * Injected instance of the HttpService used to handle HTTP requests
   * related to employee information.
   * 
   * This service provides methods for interacting with the backend API,
   * such as fetching, updating, or deleting employee data.
   */
  private httpService = inject(HttpService);
  /**
   * Injects the `ActivatedRoute` service to access route-specific information,
   * such as route parameters, query parameters, and other data associated with
   * the current route.
   */
  private route = inject(ActivatedRoute)
  /**
   * Injects the Angular Router service to enable navigation between routes.
   * The Router provides methods for programmatic navigation and route management.
   */
  private router = inject(Router)

  /**
   * A reactive signal representing the current employee's data.
   * This signal holds an object of type `Employee` and can be used
   * to track and react to changes in the employee's information.
   */
  employee = signal<Employee>({} as Employee);

  /**
   * Initializes the component by subscribing to route parameter changes and fetching
   * the corresponding employee data from the server. The employee's basic salary is
   * sanitized by removing any dollar signs before being set in the component's state.
   *
   * @remarks
   * - Uses Angular's `ActivatedRoute` to extract the `id` parameter from the route.
   * - Fetches employee data from the backend using `HttpService`.
   * - Transforms the `basic_salary` field to remove dollar signs.
   * - Updates the component's employee state with the fetched and transformed data.
   *
   * @returns void
   */
  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.httpService.get<Employee>(`http://localhost:3000/employees/${id}`)),
      map(employee => ({...employee, basic_salary: String(employee.basic_salary).replace(/\$/g, '')})),
      tap(employee => this.employee.set(employee))
    ).subscribe()
  }

  /**
   * Navigates the user back to the employee list page.
   * This method uses the Angular Router to redirect to the '/employee' route.
   */
  onGoBack() {
    this.router.navigate(['/employee']);
  }
}
