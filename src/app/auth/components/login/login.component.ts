import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services';
import { BaseAuth } from './../auth.base';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseAuth implements OnInit {
  constructor(private router: Router, private authService: AuthService) {
    super();
   }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    this.showLoader();
    this.disableForm();
    this.authService
      .login(this.form.value)
      .then(() => {
        if (this.authService.isAuthorised()) {
          this.router.navigate(['dashboard']);
        }
      })
      .finally(() => {
        this.enableForm();
        this.hideLoader();
      });
  }

  private buildForm() {
    this.form = new FormGroup({
      email: new FormControl(this.authService.user.email, [Validators.required, Validators.email]),
      password: new FormControl(this.authService.user.password, [Validators.required, Validators.minLength(6)])
    });
  }
}
