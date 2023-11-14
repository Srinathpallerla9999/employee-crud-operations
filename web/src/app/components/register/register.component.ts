import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form();
  }

  form() {
    this.registerForm = this.fb.group({
      name: ['Srinath', [Validators.required]],
      surname: ['Pallerla', [Validators.required]],
      email: ['srinathpallerla007@gmail.com', [Validators.required, Validators.email]],
      password: ['Srinath@123', [Validators.required, Validators.minLength(6), this.passwordValidator()]],
      confirm_password: ['Srinath@123', Validators.required],
      phone_no: ['9441118996', [Validators.required, this.indianPhoneNumberValidator()]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordValidator(): ValidationErrors | null {
    const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    return (control: AbstractControl): ValidationErrors | null => {
      if (!regexPattern.test(control.value)) {
        return { 'invalidPassword': true };
      }
      return null;
    };
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirm_password');

    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { 'passwordMismatch': true };
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

  isVisible: boolean = false
  passwordType = 'password';
  confirmPasswordType = 'password';
  togglePasswordVisibility(value: any) {
    this.isVisible = !this.isVisible

    if (value == 'password') {
      this.passwordType = 'password'
      if (this.isVisible)
        this.passwordType = 'text'
    }
    else if (value == 'confirmPassword') {
      this.confirmPasswordType = 'password'
      if (this.isVisible)
        this.confirmPasswordType = 'text'
    }
  }


  register(form: FormGroup) {
    if (form.valid) {
      let formDetails = form.value
      let payload = {
        name: formDetails.name,
        surname: formDetails.surname,
        email: formDetails.email,
        password: formDetails.password,
        phoneNo: formDetails.phoneNo
      }

      this.authService.registerAndLogin('register', payload).subscribe((res: any) => {
        if(res?.data?.access_token) {
          this.registerForm.reset()
          localStorage.setItem("access_token", res?.data?.access_token)
          localStorage.setItem("userName", res?.data?.username)
          this.router.navigate(['/employee'])
        }
      },
        (err: any) => {
          console.log(err);

          this.toastr.error("Error", err?.error?.message)
        })
    }
  }
}
