import { Route, Routes } from '@angular/router';

import { BaseLayoutComponent } from '../../core/layout/baseLayout/baseLayout.component';

export const employeeRoutes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/list-employee/list-employee.component').then(
            (m) => m.ListEmployeeComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/create-employee/create-employee.component').then(
            (m) => m.CreateEmployeeComponent
          ),
      },

      {
        path: 'info/:id',
        loadComponent: () =>
          import('./pages/info-employee/info-employee.component').then(
            (m) => m.InfoEmployeeComponent
          ),
      },
    ],
  },
];
