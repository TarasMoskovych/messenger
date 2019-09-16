import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { switchMap } from 'rxjs/operators';

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
      switchMap(action => this.afs.collection(`friends/${action[0].payload.doc.id}/myfriends`).valueChanges()),
      switchMap((emails: [{ email: string }]) => {
        return this.userService.getUsersByEmails(emails.map((item: { email: string }) => item.email));
      })
    );
  }
}
