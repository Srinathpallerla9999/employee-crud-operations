import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeePipe } from './employee.pipe';


@NgModule({
  declarations: [
    EmployeeComponent,
    AddEmployeeComponent,
    EmployeePipe
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddEmployeeComponent,
    EmployeePipe
  ]
})
export class EmployeeModule { }
