import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, DocumentChangeAction } from '@angular/fire/firestore';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';

import { CoreModule } from './../core.module';
import { ImageService } from './image.service';
import { InformationService } from './information.service';
import { User, Collections } from 'src/app/shared/models';

@Injectable({
  providedIn: CoreModule
})
export class UserService {
  user$ = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private imageService: ImageService,
    private informationService: InformationService
  ) {
    this.afauth.authState.subscribe((user: firebase.User) => {
      this.user$.next(user);
    });
  }

  updateName(displayName: string): Promise<void> {
    const user = this.getCurrentUser();

    return this.afs.doc(`${Collections.Users}/${user.uid}`)
      .update({ displayName })
      .then(() => user.updateProfile({ displayName, photoURL: user.photoURL}))
      .catch(e => this.informationService.showError(e));
  }

  updateImage(file: File): Observable<void> {
    const user = this.getCurrentUser();

    return this.imageService.upload(file, 'users', user.uid)
      .pipe(
        switchMap((photoURL: string) => {
          if (!photoURL) {
            return of(null);
          }
          return this.afs.doc(`${Collections.Users}/${user.uid}`)
            .update({ photoURL })
            .then(() => user.updateProfile({ displayName: user.displayName, photoURL }));
        })
      );
  }

  getAll(): Observable<User[]> {
    return this.afs.collection(Collections.Users, ref => ref.limit(20)).valueChanges()
      .pipe(map((users: User[]) => this.excludeCurrentUser(users)));
  }

  getAllByEmails(arr: string[]): Observable<User[]> {
    return this.afs.collection(Collections.Users).valueChanges()
      .pipe(map((users: User[]) => users.filter((user: User) => arr.includes(user.email))));
  }

  getByQuery(start: string, end: string): Observable<User[]> {
    return this.afs.collection(Collections.Users, ref => ref.orderBy('displayName').startAt(start).endAt(end)).valueChanges()
      .pipe(map((users: User[]) => this.excludeCurrentUser(users)));
  }

  getStatuses(users: User[]): Promise<DocumentData[]> {
    const ref = this.afs.collection(Collections.Status).ref;

    return Promise
      .all(users.map((user: User) => ref.where('email', '==', user.email).get()))
      .then((snapshots: firebase.firestore.QuerySnapshot[]) => {
        return snapshots.map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].data());
      });
  }

  checkStatuses(): Observable<DocumentChangeAction<firebase.firestore.DocumentData>[]> {
    return this.afs.collection(Collections.Status).snapshotChanges(['modified']);
  }

  private getCurrentUser(): firebase.User {
    return this.afauth.auth.currentUser;
  }

  private excludeCurrentUser(users: User[]): User[] {
    return users.filter((user: User) => user.email !== this.getCurrentUser().email);
  }
}
