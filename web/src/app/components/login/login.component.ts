import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  loginForm: any;
  passwordVisible: boolean = false;

  ngOnInit(): void {
    this.form();
  }

  form() {
    this.loginForm = this.fb.group({
      email: ['Srinath@dn.com', [Validators.required, Validators.email]],
      password: ['Srinath@123', [Validators.required, this.passwordValidator()]]
    });
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

      if (!regexPattern.test(control.value)) {
        return { 'invalidPassword': true };
      }

      return null;
    };
  }

  passwordType = 'password'

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    console.log(this.loginForm.get("password"));
    if (this.passwordVisible) {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
  }

  login(form: any) {
    if (form.valid) {
      let formDetails = form.value
      let payload = {
        email: formDetails.email,
        password: formDetails.password,
      }
      this.authService.registerAndLogin('login', payload).subscribe((res: any) => {
        if (res?.data?.access_token) {
          this.loginForm.reset()
          localStorage.setItem('access_token', res?.data?.access_token);
          localStorage.setItem('userName', res?.data?.username);
          this.router.navigate(['/employee'])
        }
      },
      (err: any)=> {
        this.toastr.error("Error", err?.error?.errors?.message)

      })
    }
  }
}
