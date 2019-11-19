import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { ElectronService } from 'ngx-electron';

import { CoreModule } from '../core.module';
import { User, Collections } from 'src/app/shared/models';
import { InformationService } from './information.service';
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
    private ngZone: NgZone,
    private informationService: InformationService,
    private electronService: ElectronService
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
      .catch(e => this.informationService.showError(e))
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
      .then((data: auth.UserCredential) => {
        this._authState = data.user;

        if (this._authState.emailVerified) {
          this.saveSessionToken(data.user.email);
          this.updateUserStatus('online');
        } else {
          this.emailVerifiedErrorHandler();
        }
      })
      .then(this.onAuthSuccess.bind(this))
      .catch(e => this.informationService.showError(e));
  }

  loginWithGoogle(): Promise<boolean> {
    if (this.electronService.isElectronApp) { return this.onSignInWithCredential(); }

    return this.afauth.auth
      .signInWithPopup(new auth.GoogleAuthProvider())
      .then(this.onGoogleAuthDone.bind(this))
      .then(this.onAuthSuccess.bind(this));
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
    const path = `${Collections.Users}/${this.getUserId()}`;
    const statusPath = `${Collections.Status}/${this.getUserId()}`;
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
    return this.afs.doc(`${Collections.Status}/${this.getUserId()}`)
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
    this.informationService.showMessage('Your account is inactive. Please, confirm Your email!');
  }

  private saveSessionToken(token: string) {
    window.sessionStorage.setItem('authorized', token);
  }

  private clearSessionToken() {
    window.sessionStorage.removeItem('authorized');
  }

  private onSignInWithCredential() {
    this.electronService.ipcRenderer.send('google:get_token');

    this.electronService.ipcRenderer.on('google:sign_in', (e, token) => {
      return auth()
        .signInWithCredential(auth.GoogleAuthProvider.credential(null, token.access_token))
        .then(this.onGoogleAuthDone.bind(this))
        .then(this.onAuthSuccess.bind(this));
    });

    return Promise.resolve(false);
  }

  private onGoogleAuthDone(data: auth.UserCredential) {
    this._authState = data.user;
    this.saveSessionToken(data.user.email);
    this.setUserData({ email: this._authState.email, displayName: this._authState.displayName }, this._authState.photoURL);
    this.updateUserStatus('online');
  }

  private onAuthSuccess() {
    if (this.authState && this.authState.emailVerified) {
      this.ngZone.run(() => this.router.navigate(['dashboard']));
    }
  }
}
