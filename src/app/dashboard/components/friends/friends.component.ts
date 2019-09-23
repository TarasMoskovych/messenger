import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { AbstractLightBox } from '../../classes/lightbox.abstract';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent extends AbstractLightBox implements OnInit {
  @Input() users: User[] = [];

  ngOnInit() {
    this.initAlbum(this.users);
  }

  onImgClick(idx: number) {
    this.openImg(idx);
  }

}
