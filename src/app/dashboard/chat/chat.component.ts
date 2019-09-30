import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgScrollbar } from 'ngx-scrollbar';

import { AuthService, ChatService, UserService } from 'src/app/core/services';
import { Message, User } from 'src/app/shared/models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild(NgScrollbar, { static: false }) scrollbar: NgScrollbar;

  private destroy$ = new Subject<boolean>();
  private sub$: Subscription;

  loader = false;
  messages: Message[];
  currentUserEmail: string;
  currentUser$: BehaviorSubject<User>;
  user: User;

  constructor(private authService: AuthService, private chatService: ChatService, private userService: UserService) { }

  ngOnInit() {
    this.onUserSelect();
    this.currentUser$ = this.userService.user$;
    this.currentUserEmail = this.authService.isAuthorised();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSendMessage(message: string) {
    this.chatService.send(message).then((isFirstMessage: boolean) => {
      if (isFirstMessage) {
        this.getMessages();
      }
    });
  }

  onScrollbarUpdate() {
    this.scrollbar.scrollTo({ bottom: 0, duration: 200 });
  }

  private onUserSelect() {
    this.chatService.selectedUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe((user: User) => {
      this.loader = true;
      this.user = user;
      this.getMessages();
    });
  }

  private getMessages() {
    if (this.sub$) { this.sub$.unsubscribe(); }
    this.sub$ = this.chatService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: Message[]) => {
        this.messages = messages.map((message: Message) => {
          message.outcome = message.sentBy === this.currentUserEmail;
          return message;
        });
        this.loader = false;
      });
  }

}
