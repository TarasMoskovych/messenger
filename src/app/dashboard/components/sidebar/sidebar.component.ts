import { Component, OnInit, OnDestroy } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FriendsService, NotificationService, RequestsService, UserService } from 'src/app/core/services';
import { User, Request } from 'src/app/shared/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();

  subLoading = false;
  showAddFriendsPanel = true;
  showRequetsPanel = true;
  showFriendsPanel = true;

  usersByRequests: User[] = [];
  requests: Request[];
  users: User[] = [];
  friends: User[] = [];

  loadedUsers = false;
  loadedFriends = false;
  loadedAllRequests = false;

  constructor(
    private notificationService: NotificationService,
    private friendsService: FriendsService,
    private requestService: RequestsService,
    private userService: UserService) { }

  ngOnInit() {
    this.getFriends();
    this.getRequests();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onLoadUsers() {
    if (!this.loadedUsers && this.loadedFriends && this.loadedAllRequests) { this.getUsers(); }
  }

  onLoadRequests() {
    this.getUsersByRequests();
  }

  onAddFriend(user: User) {
    this.subLoading = true;
    this.requestService.add(user.email).then(() => {
      this.notificationService.showMessage(`Request is sent to ${user.displayName}.`, 'Okay');
      this.subLoading = false;
      user.receiver = true;
    });
  }

  onAcceptRequest(user: User) {
    this.subLoading = true;
    this.requestService.accept(user).then(() => {
      this.notificationService.showMessage(`${user.displayName} is added`, 'Okay');
      this.subLoading = false;
      this.users = [ ...this.users.filter((u: User) => user.email !== u.email)];
      this.showAddFriendsPanel = this.users.length !== 0;
    });
  }

  onDeclineRequest(user: User) {
    this.subLoading = true;
    this.requestService.decline(user).then(() => {
      this.notificationService.showMessage(`${user.displayName} is ignored`, 'Okay');
      this.users.forEach((u: User) => {
        if (u.email === user.email) {
          u.sender = false;
        }
      });
      this.subLoading = false;
    });
  }

  private getFriends() {
    this.friendsService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        this.showFriendsPanel = users.length !== 0;
        this.friends = [...users];
        this.filterUsersByFriends(this.users);
        this.loadedFriends = true;
    });
  }

  private getRequests() {
    this.requestService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requests: Request[]) => {
        this.requests = [...requests];
        this.loadedAllRequests = true;
        this.filterUsersByRequests();
    });
  }

  private getUsers() {
    this.userService.getAll()
      .pipe(take(1))
      .subscribe((users: User[]) => {
        this.filterUsersByFriends(users);
        this.filterUsersByRequests();
        this.showAddFriendsPanel = this.users.length !== 0;
        this.loadedUsers = true;
      });
  }

  private getUsersByRequests() {
    this.requestService.getUsersByRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: User[]) => {
        this.showRequetsPanel = users.length !== 0;
        this.usersByRequests = [...users];
      });
  }

  private filterUsersByFriends(users: User[]) {
    if (!this.friends.length) { return this.users = [...users]; }
    this.users = users.filter((user: User) => this.friends.find((friend: User) => user.email !== friend.email));
  }

  private filterUsersByRequests() {
    this.users.forEach((user: User) => {
      user.receiver = false;
      user.sender = false;
    });

    this.requests.forEach((request: Request) => {
      this.users.find((user: User) => {
        if (user.email === request.receiver) { user.receiver = true; }
        if (user.email === request.sender) { user.sender = true; }
      });
    });

    this.users = [...this.users];
  }

}
