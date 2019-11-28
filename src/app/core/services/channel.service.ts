import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Collections, Channel, User } from './../../shared/models';

@Injectable({
  providedIn: CoreModule
})
export class ChannelService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) { }

  get(): Observable<Channel> {
    return this.afs.doc<Channel>(`${Collections.Channels}/${this.authService.isAuthorised()}`).valueChanges();
  }

  update(user: User, channel: string): Promise<void> {
    const { displayName, photoURL, email } = this.authService.user;
    const initiator: User = { displayName, photoURL, email };

    return this.afs.doc(`${Collections.Channels}/${user.email}`).set({ id: channel, user: initiator });
  }

  delete(email: string = this.authService.isAuthorised()): Promise<void> {
    return this.afs.doc<Channel>(`${Collections.Channels}/${email}`).delete();
  }

}
