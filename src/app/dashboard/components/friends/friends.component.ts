import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { User } from 'src/app/shared';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent implements OnInit {
  @Input() users: User[] = [];

  constructor() { }

  ngOnInit() {
  }

  onImgClick(idx: number) {

  }

}
