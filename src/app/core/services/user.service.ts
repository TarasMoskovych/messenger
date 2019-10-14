import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, DocumentChangeAction } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

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

  updateName(displayName: string): Promise<void> {
    const user = this.getCurrentUser();

    return this.afs.doc(`users/${user.uid}`)
      .update({ displayName })
      .then(() => user.updateProfile({ displayName, photoURL: user.photoURL}))
      .catch(e => this.notificationService.showError(e));
  }

  updateImage(file: File): Promise<void> {
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

  getAll(): Observable<User[]> {
    return this.afs.collection('users', ref => ref.limit(20)).valueChanges()
      .pipe(map((users: User[]) => this.excludeCurrentUser(users)));
  }

  getAllByEmails(arr: string[]): Observable<User[]> {
    return this.afs.collection('users').valueChanges()
      .pipe(map((users: User[]) => users.filter((user: User) => arr.includes(user.email))));
  }

  getByQuery(start: string, end: string): Observable<User[]> {
    return this.afs.collection('users', ref => ref.orderBy('displayName').startAt(start).endAt(end)).valueChanges()
      .pipe(map((users: User[]) => this.excludeCurrentUser(users)));
  }

  getStatuses(users: User[]): Promise<DocumentData[]> {
    const ref = this.afs.collection('status').ref;

    return Promise
      .all(users.map((user: User) => ref.where('email', '==', user.email).get()))
      .then((snapshots: firebase.firestore.QuerySnapshot[]) => {
        return snapshots.map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].data());
      });
  }

  checkStatuses(): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.afs.collection('status').snapshotChanges(['modified']);
  }

  private getCurrentUser(): firebase.User {
    return this.afauth.auth.currentUser;
  }

  private excludeCurrentUser(users: User[]): User[] {
    return users.filter((user: User) => user.email !== this.getCurrentUser().email);
  }
}
