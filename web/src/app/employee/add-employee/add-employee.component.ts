import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { EmmployeeService } from '../emmployee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  employeeForm: any;

  constructor(private fb: FormBuilder, private employeeService: EmmployeeService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.formDetails()
  }

  formDetails() {
    this.employeeForm = this.fb.group({
      name: ['Srinath', Validators.required],
      surname: ['Pallerla', Validators.required],
      email: ['Srinathpallerla007@gmail.com', [Validators.required, Validators.email]],
      phone_no: ['9441118996', [Validators.required, this.indianPhoneNumberValidator()]],
      DOJ: ['Monday', Validators.required],
      salary: [10000, [Validators.required, this.salaryValidator]],
      present_employee: [false],
    });
  }

  private indianPhoneNumberValidator(): ValidationErrors | null {
    const regexPattern = /^[6-9]\d{9}$/; // Indian phone number pattern

    return (control: AbstractControl): ValidationErrors | null => {
      if (!regexPattern.test(control.value)) {
        return { 'invalidPhoneNumber': true };
      }
      return null;
    };
  }

  private salaryValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const salary = control.value;
    if (salary !== null && (isNaN(salary) || salary < 0)) {
      return { 'invalidSalary': true };
    }
    return null;
  }

  get formControls() {
    return this.employeeForm.controls;
  }

  onSubmit(employeeForm: FormGroup) {
    if (employeeForm.valid) {
      let form = employeeForm.value
      let payload = {
        name: form.name,
        surname: form.surname,
        email: form.email,
        phone_no: form.phone_no,
        DOJ: form.DOJ,
        salary: form.salary,
        present_employee: form.presentEmployee
      }
      this.employeeService.postEmployeeDetails('employee', payload).subscribe((res: any) => {
        this.toastr.success("Success", res?.data?.message)
        // this.employeeForm.reset()
      },
        (err: any) => {
          this.toastr.error("Error", err.error.errors.message)
        })
    }
  }
}