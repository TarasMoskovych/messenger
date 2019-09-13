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
  showAddFriendsPanel = true;
  users: User[] = [];

  constructor(
    private notificationService: NotificationService,
    private requestService: RequestsService,
    private userService: UserService) { }

  ngOnInit() {
    this.getUsers();
  }

  onAddFriend(user: User) {
    this.requestService.addRequest(user.email)
      .then(() => this.notificationService.showMessage('Request is sent.', 'Okay'));
  }

  private getUsers() {
    this.userService.getUsers()
      .pipe(take(1))
      .subscribe((users: User[]) => {
        if (users.length === 0) { this.showAddFriendsPanel = false; }
        this.users = users;
      });
  }

}
