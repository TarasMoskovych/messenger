import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestsComponent implements OnInit {
  @Input() users: User[];
  @Output() acceptRequest = new EventEmitter<User>();
  @Output() declineRequest = new EventEmitter<User>();

  albums = [];

  constructor(private lightbox: Lightbox) { }

  ngOnInit() {
    this.users.forEach((user: User) => this.albums.push({ src: user.photoURL, thumb: '' }));
  }

  onAcceptRequest(user: User) {
    this.acceptRequest.emit(user);
  }

  onDeclineRequest(user: User) {
    this.declineRequest.emit(user);
  }

  onImgClick(idx: number) {
    this.lightbox.open(this.albums, idx);
  }

}
