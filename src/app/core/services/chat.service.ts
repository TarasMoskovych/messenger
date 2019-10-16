import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject, of, Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase/app';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Chat, Message, User } from './../../shared/models';
import { NotificationService } from './notification.service';
import { HashService } from './hash.service';

@Injectable({
  providedIn: CoreModule
})
export class ChatService {
  private chats = this.afs.collection('chats');
  private conversations = this.afs.collection('conversations');
  private selectedUser: User;
  private selectedUserS = new Subject<User>();
  private onSendDoneS = new Subject<boolean>();

  selectedUser$ = this.selectedUserS.asObservable();
  onSendDone$ = this.onSendDoneS.asObservable();

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private notificationService: NotificationService,
    private hashService: HashService
  ) { }

  getAll(count: number): Observable<Message[]> {
    return from(
      this.chats.ref
        .where('me', '==', this.authService.isAuthorised())
        .where('friend', '==', this.selectedUser.email)
        .get()
    ).pipe(switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
      if (snapshot.empty) {
        return of([]);
      }
      return this.conversations.doc(snapshot.docs[0].data().id).collection('messages', ref => ref
        .orderBy('timestamp', 'desc')
        .limit(count))
        .valueChanges();
    }));
  }

  send(message: string, fileMessage = false): Promise<boolean> {
    let docId1: string;
    let docId2: string;

    const populateChats = (chat: Chat) => this.chats.add({ me: chat.me, friend: chat.friend });
    const addConversation = (document: AngularFirestoreDocument) => {
      return document.collection('messages').add({
        message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        sentBy: this.authService.isAuthorised(),
        fileMessage
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
                  this.conversations.add({ key: this.hashService.generateHash() })
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

  sendFile(file: File): Promise<boolean> {
    return this.storage
      .upload(`files/picture_${this.hashService.generateHash()}`, file)
      .then((data: UploadTaskSnapshot) => {
        if (data.metadata.contentType.match('image/.*')) {
          return data.ref
            .getDownloadURL()
            .then((url: string) => this.send(url, true));
        } else {
          return data.ref.delete()
            .then(() => {
              this.notificationService.showMessage('File type is not supported!');
              return false;
            });
        }
    });
  }

  getSelected(): User {
    return this.selectedUser;
  }

  selectFriend(user: User): void {
    this.selectedUser = user;
    this.selectedUserS.next(user);
  }

  sendDone() {
    this.onSendDoneS.next(true);
  }

  close() {
    this.selectedUserS.next(null);
    this.selectedUser = null;
  }

}
