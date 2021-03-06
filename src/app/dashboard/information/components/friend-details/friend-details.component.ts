import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-friend-details',
  templateUrl: './friend-details.component.html',
  styleUrls: ['./friend-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendDetailsComponent extends AbstractLightBox {
  loader = false;

  @Input() user$: Observable<User>;
  @Output() closeChat = new EventEmitter();
  @Output() call = new EventEmitter<User>();
  @Output() removeFriend = new EventEmitter<User>();

  constructor(private cdr: ChangeDetectorRef, protected lightbox: Lightbox) {
    super(lightbox);
  }

  onImgClick(user: User) {
    this.openImg(user);
  }

  onCall(user: User) {
    this.call.emit(user);
  }

  onCloseChat() {
    this.closeChat.emit();
  }

  onRemoveFriend(friend: User) {
    this.removeFriend.emit(friend);
  }

  showLoader() {
    this.loader = true;
  }

  hideLoader() {
    this.loader = false;
    this.cdr.detectChanges();
  }

}
