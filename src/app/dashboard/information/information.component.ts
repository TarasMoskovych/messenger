import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import {
  ChatService,
  FriendsService,
  InformationService,
  NotificationService,
  GroupService,
  RtcService,
  HashService,
  ChannelService
} from 'src/app/core/services';
import { Notification, NotificationTypes, User, Group, Channel } from 'src/app/shared/models';
import { FriendDetailsComponent, GroupDetailsComponent } from './components';
import { VideoCallComponent } from './../../shared/components';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy {
  @ViewChild(FriendDetailsComponent, { static: false }) private friendsDetailsComponent: FriendDetailsComponent;
  @ViewChild(GroupDetailsComponent, { static: false }) private groupDetailsComponent: GroupDetailsComponent;

  private destroy$ = new Subject<boolean>();

  friend$: Observable<User>;
  group$: Observable<Group>;
  notifications$: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private chatService: ChatService,
    private groupService: GroupService,
    private channelService: ChannelService,
    private friendsService: FriendsService,
    private informationService: InformationService,
    private notificationService: NotificationService,
    private rtcService: RtcService,
    private hashService: HashService
  ) { }

  ngOnInit() {
    this.getFriendInfo();
    this.getGroupInfo();
    this.getNotifications();
    this.onChannelChange();
    this.rtcService.init();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onCloseChat() {
    this.chatService.close();
  }

  onCall(user: User) {
    this.openVideoCallDialog({ user, channel: this.hashService.generateHash(), outcome: true });
  }

  onRemoveFriend(friend: User) {
    this.friendsDetailsComponent.showLoader();
    this.friendsService.remove(friend)
      .pipe(take(1))
      .subscribe(() => {
        this.informationService.showMessage(`${friend.displayName} has been removed!`);
        this.notificationService.removeFriend(friend);
        this.friendsDetailsComponent.hideLoader();
        this.chatService.close();
      });
  }

  onCloseGroup() {
    this.groupService.close();
  }

  onRemoveGroup() {
    this.groupService.remove()
      .pipe(take(1))
      .subscribe(() => this.groupService.reload());

    this.groupService.close();
  }

  onChangeImage(file: File) {
    this.groupService.changeImage(file)
      .pipe(take(1))
      .subscribe(() => this.groupDetailsComponent.hideLoader());
  }

  onSelectNotification(notification: Notification) {
    if (notification.type === NotificationTypes.Message) {
      this.chatService.selectFriend(notification.sender);
      this.groupService.close();
    }
  }

  private getFriendInfo() {
    this.friend$ = this.chatService.selectedUser$;
  }

  private getGroupInfo() {
    this.group$ = this.groupService.selectedGroup$;
  }

  private getNotifications() {
    this.notifications$ = this.notificationService.length$;
  }

  private onChannelChange() {
    this.channelService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((channel: Channel) => {
        if (channel) { this.openVideoCallDialog({ user: null, channel: channel.id, outcome: false }); }
      });
  }

  private openVideoCallDialog(data: { user: User, channel: string, outcome: boolean }) {
    this.dialog.open(VideoCallComponent, {
      data,
      disableClose: true,
      panelClass: 'video-call-modal'
    });
  }
}
