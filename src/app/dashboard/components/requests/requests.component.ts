import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

import { AbstractLightBox } from '../../classes/lightbox.abstract';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent extends AbstractLightBox implements OnInit {
  @Input() users: User[];
  @Output() acceptRequest = new EventEmitter<User>();
  @Output() declineRequest = new EventEmitter<User>();

  ngOnInit() {
    this.initAlbum(this.users);
  }

  onAcceptRequest(user: User) {
    this.acceptRequest.emit(user);
  }

  onDeclineRequest(user: User) {
    this.declineRequest.emit(user);
  }

  onImgClick(idx: number) {
    this.openImg(idx);
  }

}
