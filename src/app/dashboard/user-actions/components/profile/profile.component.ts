import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Lightbox } from 'ngx-lightbox';
import { ElectronService } from 'ngx-electron';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { UserService, AuthService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AbstractLightBox implements OnInit {
  isElectronApp = this.electronService.isElectronApp;
  form: FormGroup;
  editing = false;
  updateProfile = false;
  profileImageLoaded = false;
  loading = false;
  selectedImage: File;
  user$: BehaviorSubject<User>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private electronService: ElectronService,
    protected lightbox: Lightbox
  ) {
    super(lightbox);
  }

  ngOnInit() {
    this.user$ = this.userService.user$;
  }

  onUpdateName() {
    this.loading = true;
    this.userService.updateName(this.form.value.displayName).then(this.cancel.bind(this));
  }

  onUpdatePhoto(file: File) {
    if (file) {
      this.updateProfile = true;
      this.profileImageLoaded = false;
      this.userService.updateImage(file)
        .pipe(take(1))
        .subscribe(() => this.updateProfile = false);
    }
  }

  onProfileImgLoaded() {
    this.profileImageLoaded = true;
  }

  onImgClick(user: User) {
    this.openImg(user);
  }

  showForm(name: string) {
    this.editing = true;
    this.buildForm(name);
  }

  cancel() {
    this.loading = false;
    this.editing = false;
  }

  logout() {
    this.authService.logout();
  }

  private buildForm(displayName: string) {
    this.form = new FormGroup({
      displayName: new FormControl(displayName, [Validators.required])
    });
  }

}
