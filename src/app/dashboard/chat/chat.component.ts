import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

import { AuthService, ChatService, UserService } from 'src/app/core/services';
import { Message, User } from 'src/app/shared/models';
import { appConfig } from 'src/app/configs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scroll', { static: false }) scroll: ElementRef;

  private destroy$ = new Subject<boolean>();
  private sub$: Subscription;

  count = appConfig.count;
  length = 0;
  loader = false;
  messages: Message[];
  currentUserEmail: string;
  currentUser$: BehaviorSubject<User>;
  scrollUp = false;
  user: User;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userService: UserService
  ) { }

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
    if (this.messages.length === 0) {
      this.messages.push({ message, outcome: true, sentBy: this.currentUserEmail });
      this.messages = [...this.messages];
    }

    this.chatService.send(message).then((isFirstMessage: boolean) => {
      if (isFirstMessage) {
        this.getMessages();
      }
    });
  }

  onFileUpload(file: File) {
    this.chatService.sendFile(file).then(data => console.log(data));
  }

  onGetMoreMessages() {
    this.count += appConfig.step;
    this.getMessages();
    this.scrollUp = true;
  }

  private onUserSelect() {
    this.chatService.selectedUser$
    .pipe(takeUntil(this.destroy$))
    .subscribe((user: User) => {
      this.loader = true;
      this.user = user;
      this.count = appConfig.count;
      this.getMessages();
    });
  }

  private getMessages() {
    if (this.sub$) { this.sub$.unsubscribe(); }

    this.sub$ = this.chatService.getAll(this.count)
      .pipe(takeUntil(this.destroy$))
      .subscribe((messages: Message[]) => {
        if (this.length === messages.length) {
          this.scrollUp = false;
        }

        this.length = messages.length;
        this.messages = _.reverse(messages.map((message: Message) => {
          message.outcome = message.sentBy === this.currentUserEmail;
          return message;
        }));

        this.loader = false;

        if (!this.scrollUp) {
          this.chatService.sendDone();
        }

        if (this.scrollUp) {
          this.scroll.nativeElement.scrollTop = Math.floor(this.scroll.nativeElement.scrollHeight / 1.6);
          this.scrollUp = false;
        }

        this.chatService.sendFileDone();
      });
  }

}
