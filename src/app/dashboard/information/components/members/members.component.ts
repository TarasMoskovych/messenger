import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService, FriendsService, GroupService, InformationService, NotificationService } from 'src/app/core/services';
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
    private informationService: InformationService,
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
        this.addCurrentUserRoles();
        this.cdr.detectChanges();
      });
  }

  private addCurrentUserRoles() {
    this.currentUser.owner = this.isOwner(this.currentUser);
    this.currentUser.member = this.isMember(this.currentUser);
  }

  private showNotification(user: User, isAdded: boolean) {
    const selectedGroup = this.groupService.selectedGroup.name;

    isAdded ? this.notificationService.addToGroup(user, selectedGroup) : this.notificationService.removeFromGroup(user, selectedGroup);

    this.informationService
      .showMessage(`${user.displayName} was ${isAdded ? 'added to' : 'removed from' } ${selectedGroup}`);
  }

}
