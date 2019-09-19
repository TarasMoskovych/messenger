import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from '../../classes/lightbox.abstract';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFriendComponent extends AbstractLightBox implements OnInit {
  @Input() users: User[] = [];
  @Output() addFriend = new EventEmitter<User>();

  constructor(private lightbox: Lightbox) {
    super();
  }

  ngOnInit() {
    this.initAlbum(this.users);
  }

  onAddFriend(user: User) {
    this.addFriend.emit(user);
  }

  onImgClick(idx: number) {
    this.lightbox.open(this.album, idx);
  }

}
