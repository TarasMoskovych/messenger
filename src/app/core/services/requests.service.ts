import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CoreModule } from './../core.module';
import { Collections, Request, User } from './../../shared/models';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: CoreModule
})
export class RequestsService {
  private requestRef: firebase.firestore.CollectionReference = this.afs.collection(Collections.Requests).ref;
  private friendsRef: firebase.firestore.CollectionReference = this.afs.collection(Collections.Friends).ref;

  constructor(private authService: AuthService, private userService: UserService, private afs: AngularFirestore) { }

  add(request: string): Promise<DocumentReference> {
    return this.requestRef.add({
      sender: this.authService.isAuthorised(),
      receiver: request
    });
  }

  getAll(): Observable<Request[]> {
    let receivers = [];
    return this.afs.collection(Collections.Requests, ref => ref.where('receiver', '==', this.authService.isAuthorised())).valueChanges()
      .pipe(
        switchMap((data: Request[]) => {
          receivers = data;
          return this.afs.collection(Collections.Requests, ref => ref
            .where('sender', '==', this.authService.isAuthorised()))
            .valueChanges();
        }),
        map((senders: Request[]) => receivers.concat(senders))
      );
  }

  getUsersByRequests(): Observable<User[]> {
    return this.afs.collection(Collections.Requests, ref => ref.where('receiver', '==', this.authService.isAuthorised())).valueChanges()
      .pipe(switchMap((requests: Request[]) => this.userService.getAllByEmails(requests.map((request: Request) => request.sender))));
  }

  accept(user: User): Promise<boolean> {
    const updateFriendsCollection = (snapshot: firebase.firestore.QuerySnapshot, email: string) => {
      this.afs.doc(`${Collections.Friends}/${snapshot.docs[0].id}`).collection(Collections.MyFriends).add({ email });
    };

    const updateFriendsCollectionRef = (docRef: firebase.firestore.DocumentReference, email: string) => {
      this.friendsRef.doc(docRef.id).collection(Collections.MyFriends).add({ email });
    };

    const updateSnapshot = (snapshot: firebase.firestore.QuerySnapshot, friendRefEmail: string, docRefEmail: string) => {
      if (snapshot.empty) {
        this.friendsRef.add({
          email: friendRefEmail
        }).then((docRef: firebase.firestore.DocumentReference) => {
          updateFriendsCollectionRef(docRef, docRefEmail);
        });
      } else {
        updateFriendsCollection(snapshot, docRefEmail);
      }
    };

    return new Promise(resolve => {
      this.friendsRef.where('email', '==', this.authService.isAuthorised()).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
        updateSnapshot(snapshot, this.authService.isAuthorised(), user.email);
      }).then(() => {
        this.friendsRef.where('email', '==', user.email).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
          updateSnapshot(snapshot, user.email, this.authService.isAuthorised());
        });
      }).then(() => {
        this.decline(user).then(() => {
          resolve(true);
        });
      });
    });
  }

  decline(user: User): Promise<boolean> {
    return new Promise(resolve => {
      this.requestRef.where('sender', '==', user.email).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docs[0].ref.delete().then(() => {
          resolve(true);
        });
      });
    });
  }

}
