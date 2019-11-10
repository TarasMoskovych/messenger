import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

import { Notification, NotificationTypes, User } from 'src/app/shared/models';
import { NotificationService, GroupService } from 'src/app/core/services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() user$: Observable<User>;
  @Output() selectNotification = new EventEmitter<Notification>();

  private destroy$ = new Subject<boolean>();

  notifications: Notification[] = [];
  notificationsTypes = NotificationTypes;
  user: User;

  constructor(
    private groupService: GroupService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.onUserChange();
    this.getNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onNotificationClick(notification: Notification) {
    if (notification.type === NotificationTypes.Message) {
      return this.selectNotification.emit(notification);
    }

    this.clearNotifications(notification.sender);
  }

  private onUserChange() {
    this.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User) => {
        this.user = user;

        if (!user) { return; }

        this.clearNotifications(user);
      });
  }

  private getNotifications() {
    this.notificationService.get()
      .pipe(
        takeUntil(this.destroy$),
        throttleTime(200)
      )
      .subscribe((notifications: Notification[]) => {
        if (!this.user) {
          this.notifications = notifications;
        } else {
          this.notifications = notifications.filter((n: Notification) => n.senderEmail !== this.user.email);
        }

        this.checkGroup();
        this.setLength();
        this.cdr.detectChanges();
      });
  }

  private checkGroup() {
    const group = this.notifications.find((n: Notification) => {
      return n.type === NotificationTypes.RemoveFromGroup &&
        this.groupService.selectedGroup && n.group === this.groupService.selectedGroup.name;
    });

    if (group) { this.groupService.close(); }
  }

  private clearNotifications(user: User) {
    const predicate = this.notifications.find((n: Notification) => n.senderEmail === user.email);

    if (predicate) {
      this.notificationService.clear(user);
      this.notifications = this.notifications.filter((n: Notification) => n.senderEmail !== user.email);
      this.setLength();
    }
  }

  private setLength() {
    this.notificationService.setLength(this.notifications.length);
  }

}
