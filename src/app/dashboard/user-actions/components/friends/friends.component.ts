import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

import { AbstractLightBox } from './../../../classes';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent extends AbstractLightBox {
  @Input() users: User[] = [];
  @Output() selectFriend = new EventEmitter<User>();

  onImgClick(event: MouseEvent, user: User) {
    event.stopPropagation();
    this.openImg(user);
  }

  onFriendClick(friend: User) {
    this.selectFriend.emit(friend);
  }

}
