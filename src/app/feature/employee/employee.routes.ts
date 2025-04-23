import { Route, Routes } from "@angular/router";
import { ListEmployeeComponent } from "./pages/list-employee/list-employee.component";
import { CreateEmployeeComponent } from "./pages/create-employee/create-employee.component";
import { EditEmployeeComponent } from "./pages/edit-employee/edit-employee.component";
import { BaseLayoutComponent } from "../../core/layout/baseLayout/baseLayout.component";


export const employeeRoutes: Routes = [
    {path: '', component: BaseLayoutComponent, children: [
        {
            path: '',
            loadComponent: () => import('./pages/list-employee/list-employee.component').then(m => m.ListEmployeeComponent),
        },
        {
            path: 'create',
           loadComponent: () => import('./pages/create-employee/create-employee.component').then(m => m.CreateEmployeeComponent),
        },
        {
            path: 'edit/:id',
            component: EditEmployeeComponent,
        },
        {
            path: 'info/:id',
            loadComponent: () => import('./pages/info-employee/info-employee.component').then(m => m.InfoEmployeeComponent),
        }
    ]},
]