import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ChatService, FriendsService, NotificationService, GroupService } from 'src/app/core/services';
import { User, Group } from 'src/app/shared/models';
import { FriendDetailsComponent } from './components';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  @ViewChild(FriendDetailsComponent, { static: false }) private friendsDetailsComponent: FriendDetailsComponent;

  friend$: Observable<User>;
  group$: Observable<Group>;

  constructor(
    private chatService: ChatService,
    private groupService: GroupService,
    private friendsService: FriendsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getFriendInfo();
    this.getGroupInfo();
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
        this.notificationService.showMessage(`${friend.displayName} has been removed!`);
        this.friendsDetailsComponent.hideLoader();
        this.chatService.close();
      });
  }

  private getFriendInfo() {
    this.friend$ = this.chatService.selectedUser$;
  }

  private getGroupInfo() {
    this.group$ = this.groupService.selectedGroup$;
  }

}
