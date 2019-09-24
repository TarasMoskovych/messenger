import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { AbstractLightBox } from './../../../classes';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFriendComponent extends AbstractLightBox {
  @Input() users: User[] = [];
  @Output() addFriend = new EventEmitter<User>();

  onAddFriend(user: User) {
    this.addFriend.emit(user);
  }

  onImgClick(user: User) {
    this.openImg(user);
  }

}
