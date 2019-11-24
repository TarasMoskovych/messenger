import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { CoreModule } from '../core.module';

import { AuthService } from './auth.service';
import { Collections, Channel } from './../../shared/models';

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

  update(email: string, channel: string): Promise<void> {
    return this.afs.doc(`${Collections.Channels}/${email}`).set({ id: channel });
  }

  delete(): Promise<void> {
    return this.afs.doc<Channel>(`${Collections.Channels}/${this.authService.isAuthorised()}`).delete();
  }

}
