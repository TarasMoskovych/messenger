import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData } from '@angular/fire/firestore';
import { Observable, from, Subject, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { appConfig } from 'src/app/configs';
import { AuthService } from './auth.service';

import { Group, User } from './../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private selectedGroupS = new Subject<Group>();

  selectedGroup$ = this.selectedGroupS.asObservable();
  selectedGroup: Group;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  getByCreator() {
    return this.afs.collection('groups', (ref: firebase.firestore.CollectionReference) => ref
      .where('creator', '==', this.authService.isAuthorised()))
      .valueChanges();
  }

  getMembers(): Observable<DocumentData[]> {
    return this.afs.collection('groups', (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name))
      .get()
      .pipe(switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
        return snapshot.empty ? of(null) : this.afs.doc(`groups/${snapshot.docs[0].id}`).collection('members').valueChanges();
      }));
  }

  add(name: string): Observable<void> {
    const email = this.authService.isAuthorised();
    let id: string;

    return from(this.afs.collection('groups').add({
      name,
      creator: email,
      conversationId: '',
      image: appConfig.defaultGroupUrl
    })).pipe(
      switchMap((docRef: firebase.firestore.DocumentReference) => {
        id = docRef.id;
        return docRef.collection('members').add({
          email,
          displayName: this.authService.user.displayName,
          photoURL: this.authService.user.photoURL
        });
      }),
      switchMap(() => this.afs.collection('group_conversations').add({ name, creator: email })),
      switchMap((docRef: firebase.firestore.DocumentReference) => {
        return this.afs.collection('groups').doc(id).update({ conversationId: docRef.id });
      })
    );
  }

  addMember(user: User): Observable<DocumentReference> {
    return this.afs.collection('groups', (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name)
      .where('creator', '==', this.authService.isAuthorised()))
      .get()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return !snapshot.empty ? this.afs.doc(`groups/${snapshot.docs[0].id}`).collection('members').add(user) : of(null);
        }),
        switchMap(() => {
          return this.afs.collection('member_of', (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          if (snapshot.empty) {
            return this.afs.collection('member_of').add({ email: user.email })
              .then((docRef: firebase.firestore.DocumentReference) => {
                return this.afs.doc(`member_of/${docRef.id}`).collection('groups').add(this.selectedGroup);
              });
          } else {
            return this.afs.doc(`member_of/${snapshot.docs[0].id}`).collection('groups').add(this.selectedGroup);
          }
        })
      );
  }

  removeMember(user: User) {
    return this.afs.collection('groups', (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name)
      .where('creator', '==', this.authService.isAuthorised()))
      .get()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return this.afs.doc(`groups/${snapshot.docs[0].id}`).collection('members', (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].ref.delete()),
        switchMap(() => {
          return this.afs.collection('member_of', (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return this.afs.doc(`member_of/${snapshot.docs[0].id}`)
            .collection('groups').ref
            .where('name', '==', this.selectedGroup.name)
            .where('creator', '==', this.selectedGroup.creator)
            .get();
        }),
        map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].ref.delete())
      );
  }

  select(group: Group) {
    this.selectedGroup = group;
    this.selectedGroupS.next(group);
  }

  close() {
    this.selectedGroupS.next(null);
    this.selectedGroup = null;
  }
}
