import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ChatService, FriendsService, InformationService, NotificationService, GroupService, RtcService } from 'src/app/core/services';
import { Notification, NotificationTypes, User, Group } from 'src/app/shared/models';
import { FriendDetailsComponent, GroupDetailsComponent } from './components';
import { VideoCallComponent } from './../../shared/components';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @ViewChild(FriendDetailsComponent, { static: false }) private friendsDetailsComponent: FriendDetailsComponent;
  @ViewChild(GroupDetailsComponent, { static: false }) private groupDetailsComponent: GroupDetailsComponent;

  friend$: Observable<User>;
  group$: Observable<Group>;
  notifications$: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private chatService: ChatService,
    private groupService: GroupService,
    private friendsService: FriendsService,
    private informationService: InformationService,
    private notificationService: NotificationService,
    private rtcService: RtcService
  ) { }

  ngOnInit() {
    this.getFriendInfo();
    this.getGroupInfo();
    this.getNotifications();
    this.rtcService.init();
  }

  onCloseChat() {
    this.chatService.close();
  }

  onCall(user: User) {
    this.dialog.open(VideoCallComponent, {
      data: user,
      disableClose: true,
      panelClass: 'video-call-modal'
    });
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

}
