import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

import { CoreModule } from './../core.module';

@Injectable({
  providedIn: CoreModule
})
export class UserService {
  user$ = new BehaviorSubject<firebase.User>(this.afauth.auth.currentUser);

  constructor(private afauth: AngularFireAuth) {
    this.afauth.authState.subscribe((user: firebase.User) => {
      this.user$.next(user);
    });
  }
}
