import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QuerySnapshot, DocumentReference } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Collections, Notification, NotificationTypes, User } from './../../shared/models';

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

  message(user: User): Promise<void> {
    const sender = this.authService.authState;
    const data = this.getData(user, sender);

    return this.afs.collection(Collections.Notifications).ref
      .where('receiverEmail', '==', user.email)
      .where('senderEmail', '==', sender.email)
      .where('type', '==', NotificationTypes.Message)
      .get()
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        if (!snapshot.empty) {
          snapshot.docs[0].ref.set(data);
        } else {
          this.afs.collection(Collections.Notifications).add(data);
        }
      });
  }

  addFriend(user: User): Promise<DocumentReference> {
    return this.addNotification(user, NotificationTypes.AddFriend);
  }

  removeFriend(user: User): Promise<DocumentReference> {
    return this.addNotification(user, NotificationTypes.RemoveFriend);
  }

  addToGroup(user: User, group: string) {
    return this.addNotification(user, NotificationTypes.AddToGroup, group);
  }

  removeFromGroup(user: User, group: string) {
    return this.addNotification(user, NotificationTypes.RemoveFromGroup, group);
  }

  clear(user: User): Promise<void> {
    return this.getCollection(user)
      .then((snapshot: firebase.firestore.QuerySnapshot) => {
        if (snapshot.empty) { return; }
        return snapshot.docs.forEach((element: DocumentData) => element.ref.delete());
      });
  }

  setLength(value: number): void {
    this.lengthS.next(value);
  }

  private getCollection(user: User, searchField = 'senderEmail'): Promise<QuerySnapshot<DocumentData>> {
    return this.afs.collection(Collections.Notifications).ref
      .where(searchField, '==', user.email)
      .get();
  }

  private addNotification(user: User, type: string, group: string = ''): Promise<DocumentReference> {
    return this.afs.collection(Collections.Notifications).add(this.getData(user, this.authService.authState, type, group));
  }

  private getData(user: User, user2: User, type = NotificationTypes.Message.toString(), group: string = ''): Notification {
    const sender: User = { email: user2.email, photoURL: user2.photoURL, displayName: user2.displayName };

    return {
      receiver: user,
      receiverEmail: user.email,
      sender,
      senderEmail: sender.email,
      type,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      group
    };
  }
}
