import { AuthService } from 'src/app/core/services/auth.service';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { FriendsService, GroupService, NotificationService } from 'src/app/core/services';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent implements OnInit, OnDestroy {
  private sub: Subscription;

  currentUser: User = this.authService.user;
  members: User[];
  friends$: Observable<User[]>;
  group = this.groupService.selectedGroup;

  constructor(
    private authService: AuthService,
    private friendsService: FriendsService,
    private groupService: GroupService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getMembers();
    this.friends$ = this.friendsService.getAll();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onAddFriend(friend: User) {
    this.groupService.addMember(friend)
      .pipe(take(1))
      .subscribe(() => this.showNotification(friend, true));
  }

  onRemoveFriend(friend: User) {
    this.groupService.removeMember(friend)
      .pipe(take(1))
      .subscribe(() => this.showNotification(friend, false));
  }

  isMember(friend: User): boolean {
    return !!this.members.find((f: User) => f.email === friend.email);
  }

  isOwner(user: User) {
    return user.email === this.group.creator;
  }

  private getMembers() {
    this.sub = this.groupService.getMembers()
      .subscribe((members: User[]) => {
        this.members = members;
        this.cdr.detectChanges();
      });
  }

  private showNotification(user: User, isAdded: boolean) {
    this.notificationService
      .showMessage(`${user.displayName} was ${isAdded ? 'added to' : 'removed from' } ${this.groupService.selectedGroup.name}`);
  }

}
