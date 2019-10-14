import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { AbstractLightBox } from 'src/app/dashboard/classes';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent extends AbstractLightBox {
  @Input() users: User[];
  @Output() acceptRequest = new EventEmitter<User>();
  @Output() declineRequest = new EventEmitter<User>();

  constructor(protected lightbox: Lightbox) {
    super(lightbox);
  }

  onAcceptRequest(user: User) {
    this.acceptRequest.emit(user);
  }

  onDeclineRequest(user: User) {
    this.declineRequest.emit(user);
  }

  onImgClick(user: User) {
    this.openImg(user);
  }

}
