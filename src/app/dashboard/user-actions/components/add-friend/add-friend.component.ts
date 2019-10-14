import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from 'src/app/dashboard/classes';
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

  constructor(protected lightbox: Lightbox) {
    super(lightbox);
  }

  onAddFriend(user: User) {
    this.addFriend.emit(user);
  }

  onImgClick(user: User) {
    this.openImg(user);
  }

}
