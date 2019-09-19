import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

import { CoreModule } from './../core.module';
import { NotificationService } from './notification.service';
import { User } from 'src/app/shared/models';

@Injectable({
  providedIn: CoreModule
})
export class UserService {
  user$ = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private notificationService: NotificationService
  ) {
    this.afauth.authState.subscribe((user: firebase.User) => {
      this.user$.next(user);
    });
  }

  updateName(displayName: string) {
    const user = this.getCurrentUser();

    return this.afs.doc(`users/${user.uid}`)
      .update({ displayName })
      .then(() => user.updateProfile({ displayName, photoURL: user.photoURL}))
      .catch(e => this.notificationService.showError(e));
  }

  updateImage(file: File) {
    const user = this.getCurrentUser();

    return this.storage
      .upload(`images/${user.uid}`, file)
      .then((data: UploadTaskSnapshot) => {
        return data.ref
          .getDownloadURL()
          .then((photoURL: string) => {
            return this.afs.doc(`users/${user.uid}`)
              .update({ photoURL })
              .then(() => user.updateProfile({ displayName: user.displayName, photoURL }));
      });
    });
  }

  getAll() {
    return this.afs.collection('users').valueChanges()
      .pipe(map((users: User[]) => users.filter((user: User) => user.email !== this.getCurrentUser().email)));
  }

  getAllByEmails(arr: string[]) {
    return this.afs.collection('users').valueChanges()
      .pipe(map((users: User[]) => users.filter((user: User) => arr.includes(user.email))));
  }

  private getCurrentUser() {
    return this.afauth.auth.currentUser;
  }
}
