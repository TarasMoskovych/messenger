import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { Observable, from, Subject, of, zip } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { appConfig } from 'src/app/configs';
import { AuthService } from './auth.service';

import { ImageService } from './image.service';
import { Collections, Group, User } from './../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private selectedGroupS = new Subject<Group>();
  private reloadGroupsS = new Subject<void>();

  reloadGroups$ = this.reloadGroupsS.asObservable();
  selectedGroup$ = this.selectedGroupS.asObservable();
  selectedGroup: Group;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private imageService: ImageService
  ) { }

  getAll(): Observable<DocumentData[]> {
    return zip(this.getByMemberOf(), this.getByCreator())
      .pipe(
        map((data: DocumentData[]) => [].concat(...data.filter(d => d)))
      );
  }

  getByCreator(): Observable<DocumentData[]> {
    return this.afs.collection(Collections.Groups, (ref: firebase.firestore.CollectionReference) => ref
      .where('creator', '==', this.authService.isAuthorised()))
      .valueChanges();
  }

  getByMemberOf(): Observable<DocumentData[]> {
    return this.afs.collection(Collections.MemberOf, (ref: firebase.firestore.CollectionReference) => ref
      .where('email', '==', this.authService.isAuthorised()))
      .get()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          if (snapshot.empty) {
            return of(null);
          }
          return this.afs.doc(`${Collections.MemberOf}/${snapshot.docs[0].id}`).collection(Collections.Groups).valueChanges();
        })
      );
  }

  getMembers(): Observable<DocumentData[]> {
    return this.afs.collection(Collections.Groups, (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name))
      .get()
      .pipe(switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
        if (snapshot.empty) {
          return of(null);
        }
        return this.afs.doc(`${Collections.Groups}/${snapshot.docs[0].id}`).collection(Collections.Members).valueChanges();
      }));
  }

  add(name: string): Observable<void> {
    const email = this.authService.isAuthorised();
    let id: string;

    return from(this.afs.collection(Collections.Groups).add({
      name,
      creator: email,
      conversationId: '',
      image: appConfig.defaultGroupUrl
    })).pipe(
      switchMap((docRef: firebase.firestore.DocumentReference) => {
        id = docRef.id;
        return docRef.collection(Collections.Members).add({
          email,
          displayName: this.authService.user.displayName,
          photoURL: this.authService.user.photoURL
        });
      }),
      switchMap(() => this.afs.collection(Collections.GroupConversations).add({ name, creator: email })),
      switchMap((docRef: firebase.firestore.DocumentReference) => {
        return this.afs.collection(Collections.Groups).doc(id).update({ conversationId: docRef.id });
      })
    );
  }

  addMember(user: User): Observable<DocumentReference> {
    return this.getCurrentGroupSnapshot()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          if (snapshot.empty) {
            return of(null);
          }
          return this.afs.doc(`${Collections.Groups}/${snapshot.docs[0].id}`).collection(Collections.Members).add(user);
        }),
        switchMap(() => {
          return this.afs.collection(Collections.MemberOf, (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          if (snapshot.empty) {
            return this.afs.collection(Collections.MemberOf).add({ email: user.email })
              .then((docRef: firebase.firestore.DocumentReference) => {
                return this.afs.doc(`${Collections.MemberOf}/${docRef.id}`).collection(Collections.Groups).add(this.selectedGroup);
              });
          } else {
            return this.afs.doc(`${Collections.MemberOf}/${snapshot.docs[0].id}`).collection(Collections.Groups).add(this.selectedGroup);
          }
        })
      );
  }

  remove() {
    // @TODO: Remove member of
    return this.afs.collection(Collections.Groups, (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name)
      .where('creator', '==', this.authService.isAuthorised()))
      .get()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return snapshot.docs[0].ref.delete();
        })
      );
  }

  removeMember(user: User) {
    return this.getCurrentGroupSnapshot()
      .pipe(
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return this.afs.doc(`${Collections.Groups}/${snapshot.docs[0].id}`)
            .collection(Collections.Members, (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].ref.delete()),
        switchMap(() => {
          return this.afs.collection(Collections.MemberOf, (ref: firebase.firestore.CollectionReference) => ref
            .where('email', '==', user.email))
            .get();
        }),
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          return this.afs.doc(`${Collections.MemberOf}/${snapshot.docs[0].id}`)
            .collection(Collections.Groups).ref
            .where('name', '==', this.selectedGroup.name)
            .where('creator', '==', this.selectedGroup.creator)
            .get();
        }),
        map((snapshot: firebase.firestore.QuerySnapshot) => snapshot.docs[0].ref.delete())
      );
  }

  changeImage(file: File): Observable<void> {
    let photoUrl: string;

    return this.imageService.upload(file, 'groups', this.selectedGroup.conversationId)
      .pipe(
        switchMap((url: string) => {
          photoUrl = url;
          return this.getCurrentGroupSnapshot();
        }),
        switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
          if (!photoUrl) { return of(null); }

          this.select({ ...this.selectedGroup, image: photoUrl });
          return snapshot.docs[0].ref.update({ image: photoUrl });
        })
      );
  }

  reload() {
    this.reloadGroupsS.next();
  }

  select(group: Group) {
    this.selectedGroup = group;
    this.selectedGroupS.next(group);
  }

  close() {
    this.selectedGroupS.next(null);
    this.selectedGroup = null;
  }

  private getCurrentGroupSnapshot(): Observable<QuerySnapshot<DocumentData>> {
    return this.afs.collection(Collections.Groups, (ref: firebase.firestore.CollectionReference) => ref
      .where('name', '==', this.selectedGroup.name)
      .where('creator', '==', this.authService.isAuthorised()))
      .get();
  }
}
