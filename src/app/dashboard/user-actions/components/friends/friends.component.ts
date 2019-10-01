import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from './../../../classes';
import { ChatService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent extends AbstractLightBox implements OnInit, OnDestroy {
  @Input() users: User[] = [];
  @Output() selectFriend = new EventEmitter<User>();

  selected: User;
  selected$: Subscription;

  constructor(private chatService: ChatService, protected lightbox: Lightbox) {
    super(lightbox);
  }

  ngOnInit() {
    this.selected$ = this.chatService.selectedUser$
      .subscribe((user: User) => this.selected = user);
  }

  ngOnDestroy() {
    this.selected$.unsubscribe();
  }

  onImgClick(event: MouseEvent, user: User) {
    event.stopPropagation();
    this.openImg(user);
  }

  onFriendClick(friend: User) {
    this.selectFriend.emit(friend);
  }

}
