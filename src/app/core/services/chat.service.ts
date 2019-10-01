import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Subject, of, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Chat, Message, User } from './../../shared/models';
import { MathHelper } from './../../shared/helpers';

@Injectable({
  providedIn: CoreModule
})
export class ChatService {
  private chats = this.afs.collection('chats');
  private conversations = this.afs.collection('conversations');
  private selectedUser: User;
  private selectedUserS = new Subject<User>();

  selectedUser$ = this.selectedUserS.asObservable();

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  getAll(): Observable<Message[]> {
    return from(
      this.chats.ref
        .where('me', '==', this.authService.isAuthorised())
        .where('friend', '==', this.selectedUser.email)
        .get()
    ).pipe(switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
      if (snapshot.empty) {
        return of([]);
      }
      return this.conversations.doc(snapshot.docs[0].data().id).collection('messages', ref => ref.orderBy('timestamp')).valueChanges();
    }));
  }

  send(message: string): Promise<boolean> {
    let docId1: string;
    let docId2: string;

    const populateChats = (chat: Chat) => this.chats.add({ me: chat.me, friend: chat.friend });
    const addConversation = (document: AngularFirestoreDocument) => {
      return document.collection('messages').add({
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        sentBy: this.authService.isAuthorised()
      });
    };

    return new Promise(resolve => {
      this.chats.ref
        .where('me', '==', this.authService.isAuthorised())
        .where('friend', '==', this.selectedUser.email)
        .get()
        .then((snapshot: firebase.firestore.QuerySnapshot) => {

          if (!snapshot.empty) {
            return addConversation(this.conversations.doc(snapshot.docs[0].data().id))
              .then(() => resolve(false));
          }

          populateChats({ me: this.authService.isAuthorised(), friend: this.selectedUser.email })
            .then((docRef: firebase.firestore.DocumentReference) => {
              docId1 = docRef.id;
              populateChats({ me: this.selectedUser.email, friend: this.authService.isAuthorised() })
                .then((docRef2: firebase.firestore.DocumentReference) => {
                  docId2 = docRef2.id;
                  this.conversations.add({ key: MathHelper.generateRandomNumber() })
                    .then((conversationsDocRef: firebase.firestore.DocumentReference) => {
                      addConversation(this.conversations.doc(conversationsDocRef.id))
                        .then(() => {
                          this.chats.doc(docId1).update({ id: conversationsDocRef.id})
                            .then(() => {
                              this.chats.doc(docId2).update({ id: conversationsDocRef.id });
                            }).then(() => resolve(true));
                        });
                    });
                });
            });
      });
    });
  }

  getSelected(): User {
    return this.selectedUser;
  }

  selectFriend(user: User): void {
    this.selectedUser = user;
    this.selectedUserS.next(user);
  }

}
