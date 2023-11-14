import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EmmployeeService } from './emmployee.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  deleteAndEditEnable: boolean = false;
  constructor(private employeeService: EmmployeeService, private toastr: ToastrService, private fb: FormBuilder) { }
  employeeDetails: any = []
  editFormDetails: any
  singleEmployeeDetails: any = {}
  disableForm: boolean = true
  formButton: string = "Edit Form"
  editFormId: any
  ngOnInit(): void {
    this.getAllEmployeeDetails()
    this.initializeForm()
  }

  initializeForm() {
    this.editFormDetails = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_no: ['', [Validators.required, this.indianPhoneNumberValidator()]],
      DOJ: ['', Validators.required],
      salary: [0, [Validators.required, this.salaryValidator]],
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
    return this.editFormDetails.controls;
  }

  onSubmit(formDetails: any) {
    const id = this.editFormId;
    this.employeeService.updateEmployee('employee', { id }, formDetails.value).subscribe((res: any) => {
        this.toastr.success("Success", res?.data?.message)
        document.getElementById("closePopup")?.click()
        this.getAllEmployeeDetails()
      },
      (err: any) => {
        this.toastr.error("Error", err?.error?.errors?.message)
        console.log(err);
      }
    );
  }
  

  editEmployee(data: any) {
    this.editFormId = data?._id
    document.getElementById("employeeDetailsPopup")?.click()
    this.editFormDetails.disable()
    this.deleteAndEditEnable = true;
    this.editFormDetails.patchValue({
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone_no: data.phone_no,
      DOJ: data.DOJ,
      salary: data.salary,
      present_employee: data.present_employee,
    });
  }

  getAllEmployeeDetails() {
    this.employeeService.getAllEmployeeDetails('employees').subscribe((res: any) => {
      this.employeeDetails = res.data
    },
      (err: any) => {
        this.toastr.error("Error", err?.error?.errors?.message)
        console.log(err);
      })
  }

  deleteEmployee(data: any) {
    this.deleteAndEditEnable = true;
    this.employeeService.deleteEmployee('employee', { params: { id: data._id } }).subscribe(
      (res: any) => {
        this.toastr.success("Success", res?.data?.message);
        const index = this.employeeDetails.findIndex((item: any) => item._id === data._id);
        if (index !== -1) {
          this.employeeDetails.splice(index, 1);
        }
      },
      (err: any) => {
        this.toastr.error("Error", err?.error?.errors?.message);
        console.log(err);
      }
    );
  }

  editFormValues() {
    if(this.disableForm){
      this.editFormDetails.enable()
      this.formButton = "Disbale Form"
      this.disableForm = false
    }
    else {
      this.editFormDetails.disable()
      this.formButton = "Edit Form"
      this.disableForm = true
    }
  }
}
