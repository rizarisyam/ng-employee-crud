import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/baseLayout/baseLayout.component').then(
        (m) => m.BaseLayoutComponent
      ),
  },
];
