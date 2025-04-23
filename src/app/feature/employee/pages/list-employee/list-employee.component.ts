import {
  Component,
  effect,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { HttpService } from '../../../../core/services/common-http.service';

import { map, tap } from 'rxjs';
import { EmployeeType } from '../../employee.type';
import { CommonModule } from '@angular/common';
import {
  ColumnFilter,
  TableLazyLoadEvent,
  TableModule,
  TablePageEvent,
} from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
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
    MultiSelectModule,
    ButtonModule,
    RouterModule,
    Toast,
  ],
  templateUrl: './list-employee.component.html',
  styleUrl: './list-employee.component.scss',
  providers: [MessageService],
})
export class ListEmployeeComponent {
  /**
   * Injected instance of the HttpService used to handle HTTP requests
   * related to employee data operations.
   *
   * This service provides methods for interacting with the backend API,
   * such as fetching, creating, updating, or deleting employee records.
   */
  private httpService = inject(HttpService);

  /**
   * Represents the configuration for the columns displayed in the employee list component.
   * Each column is defined by its field, header, and type.
   *
   * @property {Array<{ field: string; header: string; type: string }>} columns
   * - `field`: The key corresponding to the property in the data source.
   * - `header`: The display name of the column header.
   * - `type`: The data type of the column, which can be 'text', 'date', or 'number'.
   *
   * Example:
   * ```typescript
   * [
   *   { field: 'first_name', header: 'First Name', type: 'text' },
   *   { field: 'birthdate', header: 'Birthdate', type: 'date' },
   *   { field: 'basic_salary', header: 'Salary', type: 'number' }
   * ]
   * ```
   */
  columns: Array<{ field: string; header: string; type: string }> = [
    { field: 'first_name', header: 'First Name', type: 'text' },
    { field: 'last_name', header: 'Last Name', type: 'text' },
    { field: 'username', header: 'Username', type: 'text' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'birthdate', header: 'Birthdate', type: 'date' },
    { field: 'basic_salary', header: 'Salary', type: 'number' },
    { field: 'status', header: 'Status', type: 'text' },
    { field: 'group', header: 'Group', type: 'text' },
    { field: 'description', header: 'Description', type: 'text' },
    { field: 'action', header: 'Action', type: 'action' },
  ];

  /**
   * A reactive signal that holds the state of pagination, sorting, and filtering
   * for the employee list component.
   *
   * @property {number} per_page - The number of items to display per page.
   * @property {number} page - The current page number.
   * @property {string} query - The search query string.
   * @property {string} sort - The field by which the data is sorted.
   * @property {string} order - The order of sorting, either ascending or descending.
   * @property {Record<string, unknown>} filters - A collection of filters applied to the data.
   */
  pageData = signal<{
    per_page: number;
    page: number;
    query: string;
    sort: string;
    order: string;
    filters: Record<string, unknown>;
  }>({
    per_page: 10,
    page: 1,
    sort: '',
    order: '',
    query: '',
    filters: {},
  });

  /**
   * A reactive signal that holds the current state of employees.
   *
   * @type {Signal<EmployeeType>}
   * @remarks
   * This signal is used to manage and track the state of employees in the
   * `ListEmployeeComponent`. It is initialized with a non-null assertion
   * to ensure type safety.
   */
  employees: WritableSignal<EmployeeType> = signal<EmployeeType>(null!);

  /**
   * Initializes the `ListEmployeeComponent` and sets up a reactive effect
   * to fetch employees whenever the `pageData` signal is updated.
   *
   * The effect ensures that the `fetchEmployees` method is called
   * whenever the `pageData` signal evaluates to a truthy value.
   */

  /**
   * Injects the MessageService to handle messaging functionality within the component.
   * This service is used for displaying notifications, alerts, or other message-related features.
   */
  private messageService = inject(MessageService);
  constructor() {
    effect(() => {
      if (this.pageData()) {
        this.fetchEmployees();
      }
    });
  }

  /**
   * Handles the lazy loading of employee data for a table component.
   * This method processes the event triggered by lazy loading, extracts
   * pagination, sorting, and filtering information, and updates the page data accordingly.
   *
   * @param event - The lazy load event containing pagination, sorting, and filtering details.
   *
   * Event Properties:
   * - `rows` (number | undefined): The number of rows per page. Defaults to 10 if not provided.
   * - `first` (number | undefined): The index of the first row in the current page.
   * - `multiSortMeta` (Array<{ field: string; order: number }> | undefined): Array of sorting metadata for multiple columns.
   * - `sortField` (string | undefined): The field by which to sort the data.
   * - `sortOrder` (number | undefined): The order of sorting (1 for ascending, -1 for descending).
   * - `filters` (Record<string, { value: any; matchMode: string }> | undefined): The filtering criteria for the table.
   *
   * Processing Steps:
   * 1. Calculates the current page number based on the `first` and `rows` properties.
   * 2. Determines the sorting fields and order, supporting both single and multi-column sorting.
   * 3. Transforms the filters into a simplified key-value pair format.
   * 4. Updates the `pageData` object with the extracted pagination, sorting, and filtering information.
   *
   * Example Usage:
   * ```typescript
   * loadEmployeesLazy({
   *   rows: 10,
   *   first: 20,
   *   sortField: 'name',
   *   sortOrder: 1,
   *   filters: { name: { value: 'John', matchMode: 'contains' } }
   * });
   * ```
   */
  loadEmployeesLazy(event: TableLazyLoadEvent) {
    console.log(event);

    const rows = event.rows ?? 10;
    const page =
      event.first !== undefined ? Math.floor(event.first / rows) + 1 : 1;

    const sortField =
      event.multiSortMeta?.map((meta) => meta.field) ?? event.sortField;
    const sortOrder =
      event.multiSortMeta?.map((meta) =>
        meta.order === 1 ? 'asc' : meta.order === -1 ? 'desc' : ''
      ) ??
      (event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : '');

    // Fix: Filter transformation logic
    const filters: Record<string, string> = Object.keys(
      event.filters ?? {}
    ).reduce((acc, key) => {
      const filter = event.filters?.[key];
      const value = Array.isArray(filter) ? filter[0]?.value : filter?.value;
      const matchMode = Array.isArray(filter)
        ? filter[0]?.matchMode
        : filter?.matchMode;

      // Add key-value pair to accumulator object
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    console.log(filters);

    this.pageData.update((prev) => ({
      ...prev,
      per_page: rows,
      page: page,
      sort: Array.isArray(sortField) ? sortField.join(',') : sortField ?? '',
      order: Array.isArray(sortOrder) ? sortOrder.join(',') : sortOrder ?? '',
      filters: filters, // If you want to store filters in a single string or array
    }));
  }

  /**
   * Fetches a list of employees from the server using HTTP GET request.
   * Combines query parameters for pagination, sorting, and filtering
   * before making the request.
   *
   * @remarks
   * The method utilizes `buildQueryParams` to construct query parameters
   * for pagination, sorting, and filtering. The resulting parameters are
   * merged and passed to the HTTP service.
   *
   * @returns void
   *
   * @example
   * // Example usage:
   * this.fetchEmployees();
   *
   * @dependencies
   * - `buildQueryParams`: A method to construct query parameters.
   * - `httpService`: A service to perform HTTP requests.
   * - `tap`: RxJS operator used to handle side effects.
   * - `employees`: A state management object to store the fetched data.
   */
  fetchEmployees() {
    const params = {
      ...this.buildQueryParams('pagination'),
      ...this.buildQueryParams('sort'),
      ...this.buildQueryParams('filter'),
    };

    this.httpService
      .get<EmployeeType>('http://localhost:3000/employees', { ...params })
      .pipe(
        map(res => ({...res, data: res.data.map((item) => ({ ...item, basic_salary: String(item.basic_salary).replace(/\$/g, '') })) })),
        tap((res) => this.employees.set(res)))
      .subscribe();
  }

  /**
   * Builds query parameters for different actions such as pagination, sorting, or filtering.
   *
   * @param action - The type of action for which query parameters are being built.
   *                 It can be one of the following:
   *                 - `'pagination'`: Includes pagination-related parameters (`_page`, `_per_page`).
   *                 - `'sort'`: Includes sorting-related parameters (`_sort`, `_order`).
   *                 - `'filter'`: Includes filtering-related parameters based on provided filters.
   * @returns A record object containing the query parameters corresponding to the specified action.
   */
  buildQueryParams(
    action: 'pagination' | 'sort' | 'filter'
  ): Record<string, any> {
    const pageData = this.pageData();
    const params: Record<string, any> = {};

    if (action === 'pagination') {
      params['_page'] = pageData.page;
      params['_per_page'] = pageData.per_page;
    }

    if (action === 'sort') {
      if (pageData.sort) params['_sort'] = pageData.sort;
      if (pageData.order) params['_order'] = pageData.order;
    }

    if (action === 'filter') {
      Object.entries(pageData.filters || {}).forEach(([key, value]) => {
        if (value != null && value !== '') {
          if (key === 'birthdate') {
            params[key] = value instanceof Date ? value.toISOString() : value; // Format date as YYYY-MM-DD
          } else {
            params[key] = value;
          }
        }
      });
    }

    return params;
  }

  handleAction(type: string) {
    switch (type) {
      case 'edit':
        this.messageService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'Edit action is not implemented yet.',
          life: 3000,
        });
        break;
      case 'delete':
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Delete action is not implemented yet.',
          life: 3000,
        });
        break;
      default:
        console.log('Invalid type');
    }
  }
}
