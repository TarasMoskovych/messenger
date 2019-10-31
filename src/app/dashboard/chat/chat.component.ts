import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subject, BehaviorSubject, Subscription, Observable } from 'rxjs';
import { takeUntil, take, throttleTime } from 'rxjs/operators';

import * as _ from 'lodash';

import { AuthService, GroupService, ChatService, UserService } from 'src/app/core/services';
import { Group, Message, User } from 'src/app/shared/models';
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
  messages: Message[] = [];
  currentUserEmail: string;
  currentUser$: BehaviorSubject<User>;
  scrollUp = false;
  group: Group;
  user: User;

  constructor(
    private authService: AuthService,
    private groupService: GroupService,
    private chatService: ChatService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.onUserSelect();
    this.onGroupSelect();
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

    if (this.user) {
      this.chatService.send(message).then(this.onSendDone.bind(this));
    }

    if (this.group) {
      this.chatService.sendInGroup(message).then(this.onSendDone.bind(this));
    }
  }

  onFileUpload(file: File) {
    let obs$: Observable<boolean>;

    if (this.user) { obs$ = this.chatService.sendFile(file); }
    if (this.group) { obs$ = this.chatService.sendFileInGroup(file); }

    obs$.pipe(take(1)).subscribe();
  }

  onGetMoreMessages() {
    this.count += appConfig.step;
    this.getMessages();
    this.scrollUp = true;
  }

  private onChatChanges() {
    this.chatService.chatChanges()
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(500)
      ).subscribe(() => this.getMessages());
  }

  private onUserSelect() {
    this.chatService.selectedUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        if (!user) { return; }

        this.group = null;
        this.user = user;
        this.reinitialize();
        this.onChatChanges();
    });
  }

  private onGroupSelect() {
    this.groupService.selectedGroup$
      .pipe(takeUntil(this.destroy$))
      .subscribe((group: Group) => {
        if (!group) { return; }

        this.user = null;
        this.group = group;
        this.reinitialize();
        this.getMessages();
      });
  }

  private getMessages() {
    let messages$: Observable<Message[]>;

    if (this.sub$) { this.sub$.unsubscribe(); }
    if (this.user) { messages$ = this.chatService.getAll(this.count); }
    if (this.group) { messages$ = this.chatService.getAllInGroup(this.count); }

    this.sub$ = messages$
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(200)
      )
      .subscribe((messages: Message[]) => {
        if (this.length === messages.length) {
          this.scrollUp = false;
        }

        this.length = messages.length;

        if (messages.length) {
          this.messages = _.reverse(messages.map((message: Message) => {
            message.outcome = message.sentBy === this.currentUserEmail;
            return message;
          }));
        }

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

  private onSendDone(isFirstMessage: boolean) {
    if (isFirstMessage) {
      this.getMessages();
    }
  }

  private reinitialize() {
    this.loader = true;
    this.count = appConfig.count;
    this.messages = [];
  }

}
