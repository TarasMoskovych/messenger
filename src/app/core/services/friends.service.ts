import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { CoreModule } from '../core.module';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { User } from './../../shared/models';

@Injectable({
  providedIn: CoreModule
})
export class FriendsService {

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private afs: AngularFirestore
    ) { }

  getAll(): Observable<User[]> {
    return this.afs.collection('friends', ref => ref.where('email', '==', this.authService.isAuthorised())).snapshotChanges().pipe(
      switchMap(action => action.length > 0 ? this.afs.collection(`friends/${action[0].payload.doc.id}/myfriends`).valueChanges() : of([])),
      switchMap((emails: [{ email: string }]) => {
        return this.userService.getAllByEmails(emails.map((item: { email: string }) => item.email));
      })
    );
  }

  remove(user: User): Observable<any> {
    return this.removeFriend(this.authService.isAuthorised(), user.email)
      .pipe(switchMap(() => this.removeFriend(user.email, this.authService.isAuthorised())));
  }

  private removeFriend(myEmail: string, friendEmail: string): Observable<void> {
    let friendsId: string;

    return this.afs.collection('friends', ref => ref.where('email', '==', myEmail)).get()
    .pipe(
      switchMap((snapshot: firebase.firestore.QuerySnapshot) => {
        friendsId = snapshot.docs[0].id;
        return this.afs.collection(`friends/${friendsId}/myfriends`, ref => ref.where('email', '==', friendEmail)).get()
      }),
      switchMap((snapshot: firebase.firestore.QuerySnapshot) => this.afs.doc(`friends/${friendsId}/myfriends/${snapshot.docs[0].id}`).delete())
    );
  }
}
