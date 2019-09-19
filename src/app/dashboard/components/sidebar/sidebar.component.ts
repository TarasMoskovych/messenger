import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { FriendsService, NotificationService, RequestsService, UserService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  subLoading = false;
  showAddFriendsPanel = true;
  showRequetsPanel = true;
  showFriendsPanel = true;

  usersByRequests: User[] = [];
  users: User[] = [];
  friends: User[] = [];

  loadedUsers = false;
  loadedRequests = false;

  constructor(
    private notificationService: NotificationService,
    private friendsService: FriendsService,
    private requestService: RequestsService,
    private userService: UserService) { }

  ngOnInit() {
    this.getFriends();
  }

  onLoadUsers() {
    if (!this.loadedUsers) { this.getUsers(); }
  }

  onLoadRequests() {
    if (!this.loadedRequests) { this.getUsersByRequests(); }
  }

  onAddFriend(user: User) {
    this.subLoading = true;
    this.requestService.add(user.email).then(() => {
      this.notificationService.showMessage(`Request is sent to ${user.displayName}.`, 'Okay');
      this.subLoading = false;
    });
  }

  onAcceptRequest(user: User) {
    this.subLoading = true;
    this.requestService.accept(user).then(() => {
      this.notificationService.showMessage(`${user.displayName} is added`, 'Okay');
      this.subLoading = false;
    });
  }

  onDeclineRequest(user: User) {
    this.requestService.decline(user).then(() => this.notificationService.showMessage(`${user.displayName} is ignored`, 'Okay'));
  }

  private getFriends() {
    this.friendsService.getAll().subscribe((users: User[]) => {
      if (users.length === 0) { this.showFriendsPanel = false; }
      this.friends = users;
    });
  }

  private getUsers() {
    this.userService.getAll()
      .pipe(take(1))
      .subscribe((users: User[]) => {
        if (users.length === 0) { this.showAddFriendsPanel = false; }
        this.users = users;
        this.loadedUsers = true;
      });
  }

  private getUsersByRequests() {
    this.requestService.getUsersByRequests().subscribe((users: User[]) => {
      if (users.length === 0) { this.showRequetsPanel = false; }
      this.usersByRequests = users;
      this.loadedRequests = true;
    });
  }

}
