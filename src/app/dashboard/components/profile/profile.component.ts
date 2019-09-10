import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  editing = false;
  updateProfile = false;
  loading = false;
  selectedImage: File;
  user$: BehaviorSubject<User>;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.user$ = this.userService.user$;
  }

  onUpdateName() {
    this.loading = true;
    this.userService.updateName(this.form.value.nickname).then(this.cancel.bind(this));
  }

  onUpdatePhoto(file: File) {
    if (file) {
      this.updateProfile = true;
      this.userService.updateImage(file).finally(() => {
        this.updateProfile = false;
      });
    }
  }

  showForm(name: string) {
    this.editing = true;
    this.buildForm(name);
  }

  cancel() {
    this.loading = false;
    this.editing = false;
  }

  private buildForm(nickname: string) {
    this.form = new FormGroup({
      nickname: new FormControl(nickname, [Validators.required])
    });
  }

}
