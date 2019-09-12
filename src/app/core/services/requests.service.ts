import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { CoreModule } from './../core.module';

@Injectable({
  providedIn: CoreModule
})
export class RequestsService {
  private requestRef = this.afs.collection('requests');

  constructor(private afs: AngularFirestore, private afauth: AngularFireAuth) { }

  addRequest(request: string) {
    return this.requestRef.add({
      sender: this.afauth.auth.currentUser.email,
      reciever: request
    });
  }
}
