import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.buildForm();
  }

  onSubmit() {
    this.authService
      .createUser(this.form.value)
      .then(() => {
        this.authService.user = this.form.value;
        this.router.navigate(['login']);
      });
  }

  private buildForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      nickname: new FormControl(null, [Validators.required])
    });
  }

}
