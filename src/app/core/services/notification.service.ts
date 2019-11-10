import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Collections, Notification, User } from './../../shared/models';

@Injectable({
  providedIn: CoreModule
})
export class NotificationService {
  private lengthS = new BehaviorSubject<number>(0);

  length$ = this.lengthS.asObservable();

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  get(): Observable<Notification[]> {
    return this.afs.collection(Collections.Notifications, ref => ref
      .where('receiverEmail', '==', this.authService.isAuthorised()))
      .valueChanges()
      .pipe(map((notifications: Notification[]) => notifications));
  }

  add(user: User) {
    const data = this.getData(user, this.authService.authState);

    this.getCollection(user, 'receiverEmail')
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        if (!snapshot.empty) {
          snapshot.docs[0].ref.set(data);
        } else {
          this.afs.collection(Collections.Notifications).add(data);
        }
      });
  }

  clear(user: User): Promise<void> {
    return this.getCollection(user)
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        if (snapshot.empty) { return; }
        return snapshot.docs.forEach((element: DocumentData) => element.ref.delete());
      });
  }

  setLength(value: number) {
    this.lengthS.next(value);
  }

  private getCollection(user: User, searchField = 'senderEmail'): Promise<QuerySnapshot<DocumentData>> {
    return this.afs.collection(Collections.Notifications).ref
      .where(searchField, '==', user.email)
      .get();
  }

  private getData(user: User, user2: User): Notification {
    const sender: User = { email: user2.email, photoURL: user2.photoURL, displayName: user2.displayName };
    return {
      receiver: user,
      receiverEmail: user.email,
      sender,
      senderEmail: sender.email,
      type: 'message',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
  }
}
