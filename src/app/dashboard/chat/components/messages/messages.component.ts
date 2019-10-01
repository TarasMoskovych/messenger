import { Component, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';

import { Message, User } from 'src/app/shared/models';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {
  @Input() messages: Message[] = [];
  @Input() currentUser: User;
  @Input() userPhotoUrl: string;
  @ViewChild(NgScrollbar, { static: false }) private scrollbar: NgScrollbar;

  onScrollbarUpdate() {
    this.scrollbar.scrollTo({ bottom: 0, duration: 200 });
  }

}
