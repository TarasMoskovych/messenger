import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { CoreModule } from '../core.module';
import { User } from 'src/app/shared/models';

@Injectable({
  providedIn: CoreModule
})
export class AuthService {
  private authState = null;
  private _user: User = {
    email: null,
    password: null
  };

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.afauth.authState.subscribe((user) => {
      this.authState = user;
    });
  }

  createUser(user: User) {
    return this.afauth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        this.authState = data;
        this.afauth.auth.currentUser.updateProfile({
          displayName: user.nickname,
          photoURL: ''
        })
      .then(() => {
        this.setUserData(user, '');
      });
    });
  }

  login(user: User) {
    return this.afauth.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(data => {
        this.authState = data.user;
        this.updateUserStatus('online');
      }).catch(e => console.warn(e));
  }

  setUserData(user: User, photoUrl: string) {
    const path = `users/${this.getUserId()}`;
    const statusPath = `status/${this.getUserId()}`;
    const userDoc = this.afs.doc(path);
    const status = this.afs.doc(statusPath);

    userDoc.set({
      email: user.email,
      nickname: user.nickname,
      photoUrl
    });

    status.set({
      status: 'offline'
    });
  }

  updateUserStatus(status: string) {
    this.afs.doc(`status/${this.getUserId()}`)
      .update({ status })
      .catch(e => console.warn(e));
  }

  isAuthorised() {
    return this.authState;
  }

  set user(user: User) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  private getUserId() {
    return this.authState ? this.authState.uid : '';
  }
}
