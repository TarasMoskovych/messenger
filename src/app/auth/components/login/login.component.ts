import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    this.authService
      .login(this.form.value)
      .then(() => {
        if (this.authService.isAuthorised()) {
          this.router.navigate(['dashboard']);
        }
      });
  }

  private buildForm() {
    this.form = new FormGroup({
      email: new FormControl(this.authService.user.email, [Validators.required, Validators.email]),
      password: new FormControl(this.authService.user.password, [Validators.required, Validators.minLength(6)])
    });
  }
}
