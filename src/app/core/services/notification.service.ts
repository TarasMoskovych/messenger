import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Collections, Notification, User } from './../../shared/models';

@Injectable({
  providedIn: CoreModule
})
export class NotificationService {

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
    const sender = this.authService.authState;

    this.afs.collection(Collections.Notifications).add({
      receiver: user,
      receiverEmail: user.email,
      sender: {
        photoURL: sender.photoURL,
        displayName: sender.displayName
      },
      senderEmail: sender.email,
      type: 'message',
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  clear(user: User): Promise<void> {
    return this.afs.collection(Collections.Notifications).ref
      .where('senderEmail', '==', user.email)
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        if (snapshot.empty) { return; }
        return snapshot.docs.forEach((element: DocumentData) => element.ref.delete());
      });
  }
}
