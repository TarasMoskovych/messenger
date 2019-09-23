import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChatService } from './../../core/services';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  user: User;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.onUserSelect();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSendMessage(message: string) {
    console.log(message);
  }

  private onUserSelect() {
    this.chatService.selectedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.user = user;
      });
  }

}
