import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { NgScrollbar } from 'ngx-scrollbar';

import { Message, User } from 'src/app/shared/models';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {
  @Input() messages: Message[] = [];
  @Input() currentUser$: Observable<User>;
  @Input() userPhotoUrl: string;
  @ViewChild(NgScrollbar, { static: false }) scrollbar: NgScrollbar;


  constructor() { }

  ngOnInit() {
    console.log(this.userPhotoUrl);
  }

  onScrollbarUpdate() {
    this.scrollbar.scrollTo({ bottom: 0, duration: 200 });
  }

}
