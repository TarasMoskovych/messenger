import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';

import { NotificationService, RequestsService, UserService } from 'src/app/core/services';
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

  usersByRequests: User[] = [];
  users: User[] = [];

  loadedUsers = false;
  loadedRequests = false;

  constructor(
    private notificationService: NotificationService,
    private requestService: RequestsService,
    private userService: UserService) { }

  ngOnInit() { }

  onLoadUsers() {
    if (!this.loadedUsers) { this.getUsers(); }
  }

  onLoadRequests() {
    if (!this.loadedRequests) { this.getUsersByRequests(); }
  }

  onAddFriend(user: User) {
    this.subLoading = true;
    this.requestService.addRequest(user.email).then(() => {
      this.notificationService.showMessage(`Request is sent to ${user.displayName}.`, 'Okay');
      this.subLoading = false;
    });
  }

  onAcceptRequest(user: User) {
    this.subLoading = true;
    this.requestService.acceptRequest(user).then(() => {
      this.notificationService.showMessage(`${user.displayName} is added`, 'Okay');
      this.subLoading = false;
    });
  }

  onDeclineRequest(user: User) {
    this.requestService.declineRequest(user).then(() => this.notificationService.showMessage(`${user.displayName} is ignored`, 'Okay'));
  }

  private getUsers() {
    this.userService.getUsers()
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
