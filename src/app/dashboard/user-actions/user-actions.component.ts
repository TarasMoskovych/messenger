import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, debounceTime, distinctUntilChanged, throttleTime } from 'rxjs/operators';

import { ChatService, GroupService, FriendsService, InformationService, RequestsService, UserService } from 'src/app/core/services';
import { appConfig } from 'src/app/configs';
import { User, Request, Status, Group } from 'src/app/shared/models';

@Component({
  selector: 'app-user-actions',
  templateUrl: './user-actions.component.html',
  styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent implements OnInit, OnDestroy {
  private emailS = new Subject<string>();
  private email$ = this.emailS.asObservable();
  private destroy$ = new Subject<boolean>();

  subLoading = false;
  showAddFriendsPanel = true;
  showRequetsPanel = true;
  showFriendsPanel = true;

  usersByRequests: User[] = [];
  requests: Request[];
  users: User[] = [];
  friends: User[] = [];
  groups: Group[];

  loadedGroups = false;
  loadedFriends = false;
  loadedAllRequests = false;

  constructor(
    private chatService: ChatService,
    private groupService: GroupService,
    private informationService: InformationService,
    private friendsService: FriendsService,
    private requestService: RequestsService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getFriends();
    this.getRequests();
    this.onSearchUser();
    this.onReloadGroups();
    this.onCheckStatuses();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onLoadUsers() {
    if (this.loadedFriends && this.loadedAllRequests) { this.getUsers(); }
  }

  onLoadRequests() {
    this.getUsersByRequests();
  }

  onReloadGroups() {
    this.groupService.reloadGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getGroups());
  }

  onLoadGroups() {
    this.getGroups();
  }

  onAddFriend(user: User) {
    this.subLoading = true;
    this.requestService.add(user.email).then(() => {
      this.informationService.showMessage(`Request is sent to ${user.displayName}.`, 'Okay');
      this.subLoading = false;
      user.receiver = true;
    });
  }

  onAcceptRequest(user: User) {
    this.subLoading = true;
    this.requestService.accept(user).then(() => {
      this.informationService.showMessage(`${user.displayName} is added`, 'Okay');
      this.subLoading = false;
      this.users = [ ...this.users.filter((u: User) => user.email !== u.email)];
      this.toggleAddFriendsPanel();
    });
  }

  onDeclineRequest(user: User) {
    this.subLoading = true;
    this.requestService.decline(user).then(() => {
      this.informationService.showMessage(`${user.displayName} is ignored`, 'Okay');
      this.users.forEach((u: User) => {
        if (u.email === user.email) {
          u.sender = false;
        }
      });
      this.subLoading = false;
    });
  }

  onSelectFriend(user: User) {
    const friend = this.chatService.getSelected();

    if (friend && friend.email === user.email) { return; }

    this.chatService.selectFriend(user);
    this.groupService.close();
  }

  onInputUser(email: string) {
    this.emailS.next(email);
  }

  onAddGroup(name: string) {
    this.groupService.add(name)
      .pipe(take(1))
      .subscribe(() => {
        this.getGroups();
        this.informationService.showMessage(`${name} was created.`);
      });
  }

  private onSearchUser() {
    this.email$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(400)
      )
      .subscribe((email: string) => {
        this.userService.getByQuery(email, email + '\uf8ff')
          .pipe(take(1))
          .subscribe((users: User[]) => {
            if (email) {
              this.users = users;
              this.filterUsersByFriends(this.users);
              this.filterUsersByRequests();
            } else {
              this.getUsers();
            }
            this.toggleAddFriendsPanel();
          });
      });
  }

  private onCheckStatuses() {
    this.userService.checkStatuses()
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(appConfig.debounceTime)
      )
      .subscribe(() => this.getStatuses());
  }

  private getFriends() {
    this.friendsService.getAll()
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(appConfig.debounceTime)
      )
      .subscribe((users: User[]) => {
        this.showFriendsPanel = users.length !== 0;
        this.friends = [...users];
        this.filterUsersByFriends(this.users);
        this.loadedFriends = true;
        this.getStatuses();
    });
  }

  private getRequests() {
    this.requestService.getAll()
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(appConfig.debounceTime)
      )
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
        this.toggleAddFriendsPanel();
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

  private getStatuses() {
    this.userService.getStatuses(this.friends).then((statuses: Status[]) => {
      this.friends = this.friends.map((user: User) => {
        const status = statuses.find((s: Status) => user.email === s.email);
        if (status) { user.online = status.status === 'online'; }
        return user;
      });
    });
  }

  private filterUsersByFriends(users: User[]) {
    this.users = [...users];
    this.friends.forEach((friend: User) => {
      const idx = this.users.findIndex((u: User) => u.email === friend.email);
      if (idx > -1) {
        this.users.splice(idx, 1);
      }
    });
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

  private toggleAddFriendsPanel() {
    this.showAddFriendsPanel = this.users.length !== 0;
  }

  private getGroups() {
    this.groupService.getAll()
      .pipe(
        take(1),
        throttleTime(appConfig.debounceTime)
      )
      .subscribe((groups: Group[]) => {
        this.groups = [...groups];
        this.loadedGroups = true;
      });
  }

}
