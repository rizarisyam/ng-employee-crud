import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/baseLayout/baseLayout.component').then(
        (m) => m.BaseLayoutComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () => import("./core/auth/pages/login/login.component").then(m => m.LoginComponent)
  },
  {
    path: 'employee',
    loadChildren: () => import('./feature/employee/employee.routes').then(m => m.employeeRoutes)
  }
];
