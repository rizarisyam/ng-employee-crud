import { Route, Routes } from "@angular/router";
import { ListEmployeeComponent } from "./pages/list-employee/list-employee.component";
import { CreateEmployeeComponent } from "./pages/create-employee/create-employee.component";
import { EditEmployeeComponent } from "./pages/edit-employee/edit-employee.component";
import { BaseLayoutComponent } from "../../core/layout/baseLayout/baseLayout.component";


export const employeeRoutes: Routes = [
    {path: '', component: BaseLayoutComponent, children: [
        {
            path: '',
            component: ListEmployeeComponent,
        },
        {
            path: 'create',
            component: CreateEmployeeComponent,
        },
        {
            path: 'edit/:id',
            component: EditEmployeeComponent,
        }
    ]},
    
]