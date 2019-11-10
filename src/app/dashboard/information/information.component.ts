import { NotificationService } from './../../core/services/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ChatService, FriendsService, InformationService, GroupService } from 'src/app/core/services';
import { Notification, User, Group } from 'src/app/shared/models';
import { FriendDetailsComponent, GroupDetailsComponent } from './components';

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
    private chatService: ChatService,
    private groupService: GroupService,
    private friendsService: FriendsService,
    private informationService: InformationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getFriendInfo();
    this.getGroupInfo();
    this.getNotifications();
  }

  onCloseChat() {
    this.chatService.close();
  }

  onCall(user: User) {
    console.log(user);
  }

  onRemoveFriend(friend: User) {
    this.friendsDetailsComponent.showLoader();
    this.friendsService.remove(friend)
      .pipe(take(1))
      .subscribe(() => {
        this.informationService.showMessage(`${friend.displayName} has been removed!`);
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
    if (notification.type === 'message') {
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
