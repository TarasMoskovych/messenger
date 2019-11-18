import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/services';
import { BaseAuth } from './../auth.base';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseAuth implements OnInit {
  constructor(private authService: AuthService) {
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
      .finally(() => {
        this.enableForm();
        this.hideLoader();
      });
  }

  onLoginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  private buildForm() {
    this.form = new FormGroup({
      email: new FormControl(this.authService.user && this.authService.user.email || null, [Validators.required, Validators.email]),
      password: new FormControl(this.authService.user && this.authService.user.password || null, [Validators.required, Validators.minLength(6)])
    });
  }
}
