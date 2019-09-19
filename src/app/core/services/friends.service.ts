import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CoreModule } from '../core.module';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: CoreModule
})
export class FriendsService {

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private afs: AngularFirestore
    ) { }

  getAll() {
    return this.afs.collection('friends', ref => ref.where('email', '==', this.authService.isAuthorised())).snapshotChanges().pipe(
      switchMap(action => action.length > 0 ? this.afs.collection(`friends/${action[0].payload.doc.id}/myfriends`).valueChanges() : of([])),
      switchMap((emails: [{ email: string }]) => {
        return this.userService.getAllByEmails(emails.map((item: { email: string }) => item.email));
      })
    );
  }
}
