import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';

import { CoreModule } from './../core.module';
import { Request, User } from './../../shared/models';
import { UserService } from './user.service';

@Injectable({
  providedIn: CoreModule
})
export class RequestsService {
  private requestRef: firebase.firestore.CollectionReference = this.afs.collection('requests').ref;
  private friendsRef: firebase.firestore.CollectionReference = this.afs.collection('friends').ref;

  constructor(private userService: UserService, private afs: AngularFirestore, private afauth: AngularFireAuth) { }

  addRequest(request: string) {
    return this.requestRef.add({
      sender: this.getCurrentUserEmail(),
      receiver: request
    });
  }

  getUsersByRequests() {
    return this.afs.collection('requests', ref => ref.where('receiver', '==', this.getCurrentUserEmail())).valueChanges()
      .pipe(switchMap((requests: Request[]) => this.userService.getUsersByEmails(requests.map((request: Request) => request.sender))));
  }

  acceptRequest(user: User) {
    const updateFriendsCollection = (snapshot: firebase.firestore.QuerySnapshot, email: string) => {
      this.afs.doc(`friends/${snapshot.docs[0].id}`).collection('myfriends').add({ email });
    };

    const updateFriendsCollectionRef = (docRef: firebase.firestore.DocumentReference, email: string) => {
      this.friendsRef.doc(docRef.id).collection('myfriends').add({ email });
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
      this.friendsRef.where('email', '==', this.getCurrentUserEmail()).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
        updateSnapshot(snapshot, this.getCurrentUserEmail(), user.email);
      }).then(() => {
        this.friendsRef.where('email', '==', user.email).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
          updateSnapshot(snapshot, user.email, this.getCurrentUserEmail());
        });
      }).then(() => {
        this.declineRequest(user).then(() => {
          resolve(true);
        });
      });
    });
  }

  declineRequest(user: User) {
    return new Promise(resolve => {
      this.requestRef.where('sender', '==', user.email).get().then((snapshot: firebase.firestore.QuerySnapshot) => {
        snapshot.docs[0].ref.delete().then(() => {
          resolve(true);
        });
      });
    });
  }

  private getCurrentUserEmail() {
    return window.sessionStorage.getItem('authorized');
  }

}