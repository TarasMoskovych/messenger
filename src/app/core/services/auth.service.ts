import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

import { CoreModule } from '../core.module';
import { User } from 'src/app/shared/models';
import { NotificationService } from './notification.service';
import { appConfig } from 'src/app/configs';

@Injectable({
  providedIn: CoreModule
})
export class AuthService {
  private _authState = null;
  private _user: User = {
    email: null,
    password: null
  };

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.afauth.authState.subscribe(user => {
      this._authState = user;
      this._user = user;
      console.log(this._authState);
    });
  }

  register(user: User): Promise<void> {
    return this.afauth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .catch(e => this.notificationService.showError(e))
      .then((data) => {
        this._authState = data;
        this.afauth.auth.currentUser.updateProfile({
          displayName: user.displayName,
          photoURL: appConfig.defaultPhotoUrl
        })
      .then(()  => {
        this.afauth.auth.currentUser.sendEmailVerification();
      })
      .then(() => {
        this.setUserData(user, appConfig.defaultPhotoUrl);
      });
    });
  }

  login(user: User): Promise<void> {
    return this.afauth.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        this._authState = data.user;

        if (this._authState.emailVerified) {
          this.saveSessionToken(data.user.email);
          this.updateUserStatus('online');
        } else {
          this.emailVerifiedErrorHandler();
        }
      }).catch(e => this.notificationService.showError(e));
  }

  loginWithGoogle(): Promise<void> {
    return this.afauth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(data => {
        this._authState = data.user;
        this.saveSessionToken(data.user.email);
        this.setUserData({ email: this._authState.email, displayName: this._authState.displayName }, this._authState.photoURL);
        this.updateUserStatus('online');
      });
  }

  logout(): Promise<void> {
    return this.updateUserStatus('offline')
      .then(() => {
        this.afauth.auth.signOut();
        this.clearSessionToken();
        this.router.navigate(['login']);
      });
  }

  setUserData(user?: User, photoURL?: string): void {
    const path = `users/${this.getUserId()}`;
    const statusPath = `status/${this.getUserId()}`;
    const userDoc = this.afs.doc(path);
    const status = this.afs.doc(statusPath);

    userDoc.set({
      email: user.email,
      displayName: user.displayName,
      photoURL
    });

    status.set({
      status: 'offline',
      email: user.email
    });
  }

  updateUserStatus(status: string): Promise<void> {
    return this.afs.doc(`status/${this.getUserId()}`)
      .update({ status })
      .catch(e => console.warn(e));
  }

  isAuthorised(): string {
    return this.afauth.auth.currentUser && this.afauth.auth.currentUser.email || window.sessionStorage.getItem('authorized');
  }

  set user(user: User) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  get authState() {
    return this._authState;
  }

  private getUserId() {
    return this._authState ? this._authState.uid : '';
  }

  private emailVerifiedErrorHandler() {
    this.notificationService.showMessage('Your account is inactive. Please, confirm Your email!');
  }

  private saveSessionToken(token: string) {
    window.sessionStorage.setItem('authorized', token);
  }

  private clearSessionToken() {
    window.sessionStorage.removeItem('authorized');
  }
}
