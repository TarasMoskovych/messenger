import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CoreModule } from '../core.module';
import { User } from './../../shared/models';

@Injectable({
  providedIn: CoreModule
})
export class ChatService {
  private selectedUser = new Subject<User>();

  selectedUser$ = this.selectedUser.asObservable();

  constructor() { }

  selectFriend(user: User) {
    this.selectedUser.next(user);
  }

}
