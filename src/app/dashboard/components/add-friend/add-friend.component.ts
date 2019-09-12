import { Component, ChangeDetectionStrategy, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddFriendComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() addFriend = new EventEmitter<User>();

  albums = [];

  constructor(private lightbox: Lightbox) { }

  ngOnInit() {
    this.users.forEach((user: User) => this.albums.push({ src: user.photoURL, thumb: '' }));
  }

  onAddFriend(user: User) {
    this.addFriend.emit(user);
  }

  onImgClick(idx: number) {
    this.lightbox.open(this.albums, idx);
  }

}
