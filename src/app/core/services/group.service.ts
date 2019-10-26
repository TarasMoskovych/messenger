import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { appConfig } from 'src/app/configs';
import { AuthService } from './auth.service';

import { Group } from './../../shared/models';

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

  select(group: Group) {
    this.selectedGroup = group;
    this.selectedGroupS.next(group);
  }

  close() {
    this.selectedGroupS.next(null);
    this.selectedGroup = null;
  }
}
