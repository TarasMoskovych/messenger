import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

import { AbstractLightBox } from './../../../classes';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent extends AbstractLightBox implements OnInit {
  @Input() users: User[] = [];
  @Output() selectFriend = new EventEmitter<User>();

  ngOnInit() {
    this.initAlbum(this.users);
  }

  onImgClick(event: MouseEvent, idx: number) {
    event.stopPropagation();
    this.openImg(idx);
  }

  onFriendClick(friend: User) {
    this.selectFriend.emit(friend);
  }

}
